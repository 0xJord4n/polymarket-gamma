/**
 * Examples of customizing the Polymarket Gamma client
 */

import { PolymarketGammaClient } from '../src';

// Example 1: Custom headers (e.g., for authentication or tracking)
async function customHeadersExample() {
  const client = new PolymarketGammaClient({
    headers: {
      'X-API-Key': 'your-api-key',
      'X-Custom-Header': 'custom-value',
      'User-Agent': 'MyApp/1.0',
    },
  });

  const markets = await client.getMarkets({ limit: 5 });
  console.log(`Fetched ${markets.length} markets with custom headers`);
}

// Example 2: Custom fetch implementation (e.g., for logging)
async function _customFetchExample() {
  const customFetch = async (url: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    console.log(`[Request] ${init?.method || 'GET'} ${url}`);
    const start = Date.now();

    const response = await fetch(url, init);

    const duration = Date.now() - start;
    console.log(`[Response] ${response.status} (${duration}ms)`);

    return response;
  };

  const client = new PolymarketGammaClient({
    fetch: customFetch as typeof fetch,
  });

  await client.getMarkets({ limit: 3 });
}

// Example 3: Custom fetch with retry logic
async function _retryFetchExample() {
  const fetchWithRetry = async (url: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fetch(url, init);
      } catch (error) {
        lastError = error as Error;
        console.log(`Retry ${i + 1}/${maxRetries} failed`);
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
      }
    }

    throw lastError;
  };

  const client = new PolymarketGammaClient({
    fetch: fetchWithRetry as typeof fetch,
  });

  await client.getMarkets({ limit: 5 });
}

// Example 4: Custom fetch with caching
async function cachedFetchExample() {
  const cache = new Map<string, { data: Response; timestamp: number }>();
  const CACHE_TTL = 60000; // 1 minute

  const cachedFetch = async (url: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const cacheKey = `${init?.method || 'GET'}:${url}`;
    const cached = cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log(`[Cache Hit] ${url}`);
      return cached.data.clone();
    }

    console.log(`[Cache Miss] ${url}`);
    const response = await fetch(url, init);

    cache.set(cacheKey, {
      data: response.clone(),
      timestamp: Date.now(),
    });

    return response;
  };

  const client = new PolymarketGammaClient({
    fetch: cachedFetch as typeof fetch,
  });

  // First call - cache miss
  await client.getMarkets({ limit: 5 });

  // Second call - cache hit
  await client.getMarkets({ limit: 5 });
}

// Example 5: Using a different HTTP client (e.g., axios-like wrapper)
async function _axiosStyleExample() {
  // Wrap another HTTP library to match fetch API
  const axiosFetch = async (url: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    // In a real scenario, you'd use axios or another library here
    // This is just an example showing the pattern
    console.log('Using custom HTTP client for:', url);
    return fetch(url, init);
  };

  const client = new PolymarketGammaClient({
    fetch: axiosFetch as typeof fetch,
    baseUrl: 'https://gamma-api.polymarket.com', // Can customize base URL
    timeout: 10000, // 10 second timeout
  });

  await client.getMarkets({ limit: 5 });
}

// Example 6: Rate limiting
async function _rateLimitedFetchExample() {
  let lastRequestTime = 0;
  const MIN_REQUEST_INTERVAL = 100; // 100ms between requests

  const rateLimitedFetch = async (
    url: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;

    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      await new Promise((resolve) =>
        setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest),
      );
    }

    lastRequestTime = Date.now();
    return fetch(url, init);
  };

  const client = new PolymarketGammaClient({
    fetch: rateLimitedFetch as typeof fetch,
  });

  // Make multiple requests - they'll be rate limited
  await Promise.all([
    client.getMarkets({ limit: 1 }),
    client.getMarkets({ limit: 2 }),
    client.getMarkets({ limit: 3 }),
  ]);
}

// Run examples
async function _main() {
  console.log('=== Custom Client Examples ===\n');

  await customHeadersExample();
  console.log('\n---\n');

  await cachedFetchExample();
}

// Uncomment to run
// _main().catch(console.error);
