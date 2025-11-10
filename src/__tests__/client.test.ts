import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PolymarketGammaClient } from '../client';
import type { Event, GammaMarket, PaginatedResponse, SearchResults, Tag } from '../types';

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch as unknown as typeof fetch;

describe('PolymarketGammaClient', () => {
  let client: PolymarketGammaClient;

  beforeEach(() => {
    client = new PolymarketGammaClient();
    mockFetch.mockClear();
  });

  describe('constructor', () => {
    it('should create client with default config', () => {
      const defaultClient = new PolymarketGammaClient();
      expect(defaultClient).toBeInstanceOf(PolymarketGammaClient);
    });

    it('should create client with custom config', () => {
      const customClient = new PolymarketGammaClient({
        baseUrl: 'https://custom.api.com',
        timeout: 5000,
      });
      expect(customClient).toBeInstanceOf(PolymarketGammaClient);
    });

    it('should accept custom fetch implementation', async () => {
      const customFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [],
      });

      const customClient = new PolymarketGammaClient({
        fetch: customFetch as unknown as typeof fetch,
      });

      await customClient.getMarkets();

      expect(customFetch).toHaveBeenCalled();
    });

    it('should include custom headers in requests', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      const customClient = new PolymarketGammaClient({
        headers: {
          'X-API-Key': 'test-key',
          'X-Custom': 'value',
        },
      });

      await customClient.getMarkets();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-API-Key': 'test-key',
            'X-Custom': 'value',
          }),
        }),
      );
    });
  });

  describe('search', () => {
    it('should search with query parameter', async () => {
      const mockResults: SearchResults = {
        events: [{ id: '1', title: 'Test Event' }],
        tags: [{ id: '1', label: 'Test Tag' }],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResults,
      });

      const results = await client.search({ query: 'bitcoin' });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/public-search'),
        expect.any(Object),
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('query=bitcoin'),
        expect.any(Object),
      );
      expect(results).toEqual(mockResults);
    });

    it('should search with limit and offset', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ events: [], tags: [] }),
      });

      await client.search({ query: 'test', limit: 10, offset: 20 });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('limit=10'),
        expect.any(Object),
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('offset=20'),
        expect.any(Object),
      );
    });
  });

  describe('getMarket', () => {
    it('should get market by slug', async () => {
      const mockMarket: GammaMarket = {
        id: '1',
        slug: 'test-market',
        question: 'Will BTC hit 100k?',
        active: true,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMarket,
      });

      const market = await client.getMarket('test-market');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/markets/slug/test-market'),
        expect.any(Object),
      );
      expect(market).toEqual(mockMarket);
    });

    it('should get market by ID', async () => {
      const mockMarket: GammaMarket = {
        id: '123',
        question: 'Test market',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMarket,
      });

      await client.getMarket('123');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/markets/123'),
        expect.any(Object),
      );
    });
  });

  describe('getMarkets', () => {
    it('should get markets without filters', async () => {
      const mockMarkets: GammaMarket[] = [
        { id: '1', question: 'Market 1' },
        { id: '2', question: 'Market 2' },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMarkets,
      });

      const markets = await client.getMarkets();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/markets'),
        expect.any(Object),
      );
      expect(markets).toEqual(mockMarkets);
    });

    it('should get markets with filters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await client.getMarkets({
        active: true,
        limit: 10,
        offset: 0,
        tags: ['politics', 'sports'],
        order_by: 'volume',
      });

      const callUrl = mockFetch.mock.calls[0][0];
      expect(callUrl).toContain('active=true');
      expect(callUrl).toContain('limit=10');
      expect(callUrl).toContain('offset=0');
      expect(callUrl).toContain('tags=politics');
      expect(callUrl).toContain('tags=sports');
      expect(callUrl).toContain('order_by=volume');
    });
  });

  describe('getMarketTags', () => {
    it('should get tags for a market', async () => {
      const mockTags: Tag[] = [
        { id: '1', label: 'Politics' },
        { id: '2', label: 'US Elections' },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTags,
      });

      const tags = await client.getMarketTags('market-123');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/markets/market-123/tags'),
        expect.any(Object),
      );
      expect(tags).toEqual(mockTags);
    });
  });

  describe('getEvent', () => {
    it('should get event by slug', async () => {
      const mockEvent: Event = {
        id: '1',
        slug: 'test-event',
        title: 'Test Event',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvent,
      });

      const event = await client.getEvent('test-event');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/events/slug/test-event'),
        expect.any(Object),
      );
      expect(event).toEqual(mockEvent);
    });

    it('should get event by ID', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: '456' }),
      });

      await client.getEvent('456');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/events/456'),
        expect.any(Object),
      );
    });
  });

  describe('getEvents', () => {
    it('should get events with filters', async () => {
      const mockEvents: Event[] = [{ id: '1', title: 'Event 1' }];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockEvents,
      });

      await client.getEvents({
        active: true,
        limit: 5,
        tags: ['crypto'],
      });

      const callUrl = mockFetch.mock.calls[0][0];
      expect(callUrl).toContain('active=true');
      expect(callUrl).toContain('limit=5');
      expect(callUrl).toContain('tags=crypto');
    });
  });

  describe('getEventsPaginated', () => {
    it('should get events with pagination metadata', async () => {
      const mockResponse: PaginatedResponse<Event> = {
        data: [
          { id: '1', title: 'Event 1' },
          { id: '2', title: 'Event 2' },
        ],
        pagination: {
          hasMore: true,
          totalResults: 100,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await client.getEventsPaginated({
        active: true,
        limit: 2,
        offset: 0,
        order: 'startDate',
        ascending: false,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/events/pagination'),
        expect.any(Object),
      );
      expect(result.data).toHaveLength(2);
      expect(result.pagination.hasMore).toBe(true);
      expect(result.pagination.totalResults).toBe(100);
    });

    it('should handle pagination parameters correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [], pagination: { hasMore: false, totalResults: 0 } }),
      });

      await client.getEventsPaginated({
        active: true,
        archived: false,
        closed: false,
        order: 'startDate',
        ascending: false,
        limit: 10,
        offset: 20,
      });

      const callUrl = mockFetch.mock.calls[0][0];
      expect(callUrl).toContain('active=true');
      expect(callUrl).toContain('archived=false');
      expect(callUrl).toContain('closed=false');
      expect(callUrl).toContain('order=startDate');
      expect(callUrl).toContain('ascending=false');
      expect(callUrl).toContain('limit=10');
      expect(callUrl).toContain('offset=20');
    });
  });

  describe('getTags', () => {
    it('should get all tags', async () => {
      const mockTags: Tag[] = [
        { id: '1', label: 'Politics' },
        { id: '2', label: 'Sports' },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTags,
      });

      const tags = await client.getTags();

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/tags'), expect.any(Object));
      expect(tags).toEqual(mockTags);
    });

    it('should get tags with pagination', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await client.getTags({ limit: 20, offset: 10 });

      const callUrl = mockFetch.mock.calls[0][0];
      expect(callUrl).toContain('limit=20');
      expect(callUrl).toContain('offset=10');
    });
  });

  describe('getRelatedTags', () => {
    it('should get related tags by slug', async () => {
      const mockTags: Tag[] = [{ id: '1', label: 'Related Tag' }];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTags,
      });

      await client.getRelatedTags('politics-tag');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/tags/slug/politics-tag/related-tags'),
        expect.any(Object),
      );
    });

    it('should get related tags by ID', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await client.getRelatedTags('123');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/tags/123/related-tags'),
        expect.any(Object),
      );
    });
  });

  describe('getTeams', () => {
    it('should get teams', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: '1', name: 'Team 1' }],
      });

      await client.getTeams();

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/teams'), expect.any(Object));
    });
  });

  describe('getSports', () => {
    it('should get sports', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: '1', name: 'Basketball' }],
      });

      await client.getSports();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/sports'),
        expect.any(Object),
      );
    });
  });

  describe('getSeries', () => {
    it('should get all series', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: '1', title: 'Series 1' }],
      });

      await client.getSeries();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/series'),
        expect.any(Object),
      );
    });
  });

  describe('getSeriesById', () => {
    it('should get series by ID', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: '123', title: 'Test Series' }),
      });

      await client.getSeriesById('123');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/series/123'),
        expect.any(Object),
      );
    });
  });

  describe('getComments', () => {
    it('should get comments', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: '1', content: 'Great market!' }],
      });

      await client.getComments({ limit: 10 });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/comments'),
        expect.any(Object),
      );
    });
  });

  describe('getCommentsByUser', () => {
    it('should get comments by user address', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await client.getCommentsByUser('0x123abc');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/comments/user_address/0x123abc'),
        expect.any(Object),
      );
    });
  });

  describe('grokEventSummary', () => {
    it('should get event summary from Grok AI', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ summary: 'This is a summary' }),
      });

      const summary = await client.grokEventSummary('test-event');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://polymarket.com/api/grok/event-summary',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ event_slug: 'test-event' }),
        }),
      );
      expect(summary).toBe('This is a summary');
    });
  });

  describe('grokElectionMarketExplanation', () => {
    it('should get market explanation from Grok AI', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ explanation: 'This is an explanation' }),
      });

      const explanation = await client.grokElectionMarketExplanation('test-market');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://polymarket.com/api/grok/election-market-explanation',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ market_slug: 'test-market' }),
        }),
      );
      expect(explanation).toBe('This is an explanation');
    });
  });

  describe('error handling', () => {
    it('should throw error on HTTP error response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(client.getMarket('nonexistent')).rejects.toThrow('HTTP 404: Not Found');
    });

    it('should handle timeout', async () => {
      const shortTimeoutClient = new PolymarketGammaClient({ timeout: 100 });

      mockFetch.mockImplementationOnce(
        () =>
          new Promise((resolve, reject) => {
            setTimeout(() => resolve({ ok: true, json: async () => ({}) }), 1000);
            // Simulate abort after timeout
            setTimeout(() => reject(new Error('This operation was aborted')), 100);
          }),
      );

      await expect(shortTimeoutClient.getMarkets()).rejects.toThrow();
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(client.getMarkets()).rejects.toThrow('Network error');
    });
  });

  describe('request handling', () => {
    it('should parse JSON string fields automatically', async () => {
      const mockMarket: GammaMarket = {
        id: '1',
        question: 'Test market',
        outcomes: '["Yes", "No"]' as unknown as string[],
        outcome_prices: '["0.5", "0.5"]' as unknown as string[],
        clob_token_ids: '["123", "456"]' as unknown as string[],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMarket,
      });

      const market = await client.getMarket('test');

      expect(market.outcomes).toEqual(['Yes', 'No']);
      expect(market.outcome_prices).toEqual(['0.5', '0.5']);
      expect(market.clob_token_ids).toEqual(['123', '456']);
    });

    it('should parse JSON string fields in arrays', async () => {
      const mockMarkets = [
        {
          id: '1',
          outcomes: '["Yes", "No"]',
          clob_token_ids: '["123"]',
        },
        {
          id: '2',
          outcomes: '["A", "B", "C"]',
          clob_token_ids: '["456"]',
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMarkets,
      });

      const markets = await client.getMarkets();

      expect(markets[0].outcomes).toEqual(['Yes', 'No']);
      expect(markets[0].clob_token_ids).toEqual(['123']);
      expect(markets[1].outcomes).toEqual(['A', 'B', 'C']);
      expect(markets[1].clob_token_ids).toEqual(['456']);
    });

    it('should parse camelCase JSON string fields', async () => {
      const mockMarket = {
        id: '1',
        outcomePrices: '["0.5", "0.5"]',
        clobTokenIds: '["123456", "789012"]',
        umaResolutionStatuses: '["proposed", "resolved"]',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMarket,
      });

      const market = await client.getMarket('test');

      expect(market.outcomePrices).toEqual(['0.5', '0.5']);
      expect(market.clobTokenIds).toEqual(['123456', '789012']);
      expect(market.umaResolutionStatuses).toEqual(['proposed', 'resolved']);
    });

    it('should include proper headers', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await client.getMarkets();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      );
    });

    it('should handle array parameters correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await client.getMarkets({ tags: ['tag1', 'tag2', 'tag3'] });

      const callUrl = mockFetch.mock.calls[0][0];
      expect(callUrl).toContain('tags=tag1');
      expect(callUrl).toContain('tags=tag2');
      expect(callUrl).toContain('tags=tag3');
    });

    it('should skip undefined and null parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await client.getMarkets({
        limit: 10,
        offset: undefined,
        active: undefined,
      });

      const callUrl = mockFetch.mock.calls[0][0];
      expect(callUrl).toContain('limit=10');
      expect(callUrl).not.toContain('offset');
      expect(callUrl).not.toContain('active');
    });
  });
});
