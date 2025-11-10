/**
 * Polymarket Gamma API Client
 * TypeScript client for accessing Polymarket's prediction markets and events
 */

import type {
  Comment,
  Event,
  EventFilters,
  EventPaginationFilters,
  GammaMarket,
  MarketFilters,
  PaginatedResponse,
  PaginationParams,
  SearchParams,
  SearchResults,
  Series,
  Sport,
  Tag,
  Team,
} from './types';

/**
 * Configuration options for the Gamma client
 */
export interface GammaClientConfig {
  baseUrl?: string;
  timeout?: number;
  fetch?: typeof fetch;
  headers?: Record<string, string>;
}

/**
 * Polymarket Gamma API Client
 * Provides methods to access prediction markets, events, tags, and related data
 */
export class PolymarketGammaClient {
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly fetchFn: typeof fetch;
  private readonly customHeaders: Record<string, string>;

  /**
   * Creates a new Polymarket Gamma API client
   * @param config - Optional configuration
   */
  constructor(config: GammaClientConfig = {}) {
    this.baseUrl = config.baseUrl ?? 'https://gamma-api.polymarket.com';
    this.timeout = config.timeout ?? 30000;
    this.fetchFn = config.fetch ?? globalThis.fetch;
    this.customHeaders = config.headers ?? {};
  }

  /**
   * Parse JSON string fields that the API returns as strings instead of arrays/objects
   */
  private parseJsonFields(data: unknown): unknown {
    if (!data || typeof data !== 'object') {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.parseJsonFields(item));
    }

    const parsed: Record<string, unknown> = {};
    // API uses both camelCase and snake_case
    const jsonStringFields = [
      'outcomes',
      'outcome_prices',
      'outcomePrices',
      'clob_token_ids',
      'clobTokenIds',
      'uma_resolution_statuses',
      'umaResolutionStatuses',
    ];

    for (const [key, value] of Object.entries(data)) {
      if (jsonStringFields.includes(key) && typeof value === 'string' && value.startsWith('[')) {
        try {
          parsed[key] = JSON.parse(value);
        } catch {
          parsed[key] = value;
        }
      } else if (value && typeof value === 'object') {
        parsed[key] = this.parseJsonFields(value);
      } else {
        parsed[key] = value;
      }
    }

    return parsed;
  }

  /**
   * Internal method to make HTTP requests
   */
  private async request<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
    const url = new URL(endpoint, this.baseUrl);

    // Add query parameters
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            for (const item of value) {
              url.searchParams.append(key, String(item));
            }
          } else {
            url.searchParams.append(key, String(value));
          }
        }
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await this.fetchFn(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...this.customHeaders,
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return this.parseJsonFields(data) as T;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Internal method to make POST requests
   */
  private async post<T>(url: string, body: Record<string, unknown>): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await this.fetchFn(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.customHeaders,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return (await response.json()) as T;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // ==================== Search Methods ====================

  /**
   * Search across events, tags, and profiles
   * @param params - Search parameters
   * @returns Search results
   */
  async search(params: SearchParams): Promise<SearchResults> {
    return this.request<SearchResults>('/public-search', params);
  }

  // ==================== Market Methods ====================

  /**
   * Get a market by ID or slug
   * @param idOrSlug - Market ID or slug
   * @returns Market details
   */
  async getMarket(idOrSlug: string): Promise<GammaMarket> {
    // Check if it's a slug (contains hyphens) or ID
    const endpoint = idOrSlug.includes('-') ? `/markets/slug/${idOrSlug}` : `/markets/${idOrSlug}`;
    return this.request<GammaMarket>(endpoint);
  }

  /**
   * Get markets with optional filtering and pagination
   * @param filters - Filter and pagination parameters
   * @returns Array of markets
   */
  async getMarkets(filters?: MarketFilters): Promise<GammaMarket[]> {
    return this.request<GammaMarket[]>('/markets', filters);
  }

  /**
   * Get tags for a specific market
   * @param marketId - Market ID
   * @returns Array of tags
   */
  async getMarketTags(marketId: string): Promise<Tag[]> {
    return this.request<Tag[]>(`/markets/${marketId}/tags`);
  }

  // ==================== Event Methods ====================

  /**
   * Get an event by ID or slug
   * @param idOrSlug - Event ID or slug
   * @returns Event details
   */
  async getEvent(idOrSlug: string): Promise<Event> {
    const endpoint = idOrSlug.includes('-') ? `/events/slug/${idOrSlug}` : `/events/${idOrSlug}`;
    return this.request<Event>(endpoint);
  }

  /**
   * Get events with optional filtering and pagination
   * @param filters - Filter and pagination parameters
   * @returns Array of events
   */
  async getEvents(filters?: EventFilters): Promise<Event[]> {
    return this.request<Event[]>('/events', filters);
  }

  /**
   * Get tags for a specific event
   * @param eventId - Event ID
   * @returns Array of tags
   */
  async getEventTags(eventId: string): Promise<Tag[]> {
    return this.request<Tag[]>(`/events/${eventId}/tags`);
  }

  /**
   * Get events with pagination metadata
   * @param filters - Filter and pagination parameters
   * @returns Paginated response with events and metadata
   */
  async getEventsPaginated(filters?: EventPaginationFilters): Promise<PaginatedResponse<Event>> {
    return this.request<PaginatedResponse<Event>>('/events/pagination', filters);
  }

  // ==================== Tag Methods ====================

  /**
   * Get all tags
   * @param params - Optional pagination parameters
   * @returns Array of tags
   */
  async getTags(params?: PaginationParams): Promise<Tag[]> {
    return this.request<Tag[]>('/tags', params);
  }

  /**
   * Get a specific tag by ID or slug
   * @param idOrSlug - Tag ID or slug
   * @returns Tag details
   */
  async getTag(idOrSlug: string): Promise<Tag> {
    return this.request<Tag>(`/tags/${idOrSlug}`);
  }

  /**
   * Get related tags for a specific tag
   * @param idOrSlug - Tag ID or slug
   * @returns Array of related tags
   */
  async getRelatedTags(idOrSlug: string): Promise<Tag[]> {
    const endpoint = idOrSlug.includes('-')
      ? `/tags/slug/${idOrSlug}/related-tags`
      : `/tags/${idOrSlug}/related-tags`;
    return this.request<Tag[]>(endpoint);
  }

  /**
   * Get all tags related to a specific tag
   * @param idOrSlug - Tag ID or slug
   * @returns Array of tags
   */
  async getRelatedTagsTags(idOrSlug: string): Promise<Tag[]> {
    const endpoint = idOrSlug.includes('-')
      ? `/tags/slug/${idOrSlug}/related-tags/tags`
      : `/tags/${idOrSlug}/related-tags/tags`;
    return this.request<Tag[]>(endpoint);
  }

  // ==================== Team and Sport Methods ====================

  /**
   * Get all teams
   * @param params - Optional pagination parameters
   * @returns Array of teams
   */
  async getTeams(params?: PaginationParams): Promise<Team[]> {
    return this.request<Team[]>('/teams', params);
  }

  /**
   * Get all sports
   * @param params - Optional pagination parameters
   * @returns Array of sports
   */
  async getSports(params?: PaginationParams): Promise<Sport[]> {
    return this.request<Sport[]>('/sports', params);
  }

  // ==================== Series Methods ====================

  /**
   * Get all series
   * @param params - Optional pagination parameters
   * @returns Array of series
   */
  async getSeries(params?: PaginationParams): Promise<Series[]> {
    return this.request<Series[]>('/series', params);
  }

  /**
   * Get a specific series by ID
   * @param seriesId - Series ID
   * @returns Series details
   */
  async getSeriesById(seriesId: string): Promise<Series> {
    return this.request<Series>(`/series/${seriesId}`);
  }

  // ==================== Comment Methods ====================

  /**
   * Get comments with optional filtering
   * @param params - Optional pagination and filter parameters
   * @returns Array of comments
   */
  async getComments(params?: PaginationParams): Promise<Comment[]> {
    return this.request<Comment[]>('/comments', params);
  }

  /**
   * Get a specific comment by ID
   * @param commentId - Comment ID
   * @returns Comment details
   */
  async getComment(commentId: string): Promise<Comment> {
    return this.request<Comment>(`/comments/${commentId}`);
  }

  /**
   * Get comments by user address
   * @param userAddress - User's Ethereum address
   * @param params - Optional pagination parameters
   * @returns Array of comments
   */
  async getCommentsByUser(userAddress: string, params?: PaginationParams): Promise<Comment[]> {
    return this.request<Comment[]>(`/comments/user_address/${userAddress}`, params);
  }

  // ==================== Grok AI Methods ====================

  /**
   * Get Grok AI-powered event summary
   * @param eventSlug - Event slug
   * @returns Event summary text
   */
  async grokEventSummary(eventSlug: string): Promise<string> {
    const response = await this.post<{ summary: string }>(
      'https://polymarket.com/api/grok/event-summary',
      { event_slug: eventSlug },
    );
    return response.summary;
  }

  /**
   * Get Grok AI-powered election market explanation
   * @param marketSlug - Market slug
   * @returns Market explanation text
   */
  async grokElectionMarketExplanation(marketSlug: string): Promise<string> {
    const response = await this.post<{ explanation: string }>(
      'https://polymarket.com/api/grok/election-market-explanation',
      { market_slug: marketSlug },
    );
    return response.explanation;
  }
}
