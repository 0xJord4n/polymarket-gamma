# polymarket-gamma

[![NPM Version](https://img.shields.io/npm/v/polymarket-gamma.svg)](https://www.npmjs.com/package/polymarket-gamma)
[![NPM Downloads](https://img.shields.io/npm/dm/polymarket-gamma.svg)](https://www.npmjs.com/package/polymarket-gamma)
[![License](https://img.shields.io/npm/l/polymarket-gamma.svg)](https://github.com/0xjord4n/polymarket-gamma/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![GitHub Stars](https://img.shields.io/github/stars/0xjord4n/polymarket-gamma.svg)](https://github.com/0xjord4n/polymarket-gamma/stargazers)
[![GitHub Issues](https://img.shields.io/github/issues/0xjord4n/polymarket-gamma.svg)](https://github.com/0xjord4n/polymarket-gamma/issues)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/polymarket-gamma)](https://bundlephobia.com/package/polymarket-gamma)
[![Tests](https://img.shields.io/badge/tests-37%20passing-brightgreen.svg)](https://github.com/0xjord4n/polymarket-gamma)

A clean, type-safe TypeScript client for the Polymarket Gamma API. Access prediction markets, events, tags, and related data with full TypeScript support.

## Features

- 🎯 **Type-Safe** - Full TypeScript support with comprehensive type definitions
- 🚀 **Simple API** - Intuitive methods for accessing all Gamma API endpoints
- 📦 **Zero Config** - Works out of the box with sensible defaults
- 🔄 **Modern** - Built with modern JavaScript features (ESM, async/await)
- 🧪 **Well-Tested** - Comprehensive test suite with 37 passing tests
- 🔧 **Customizable** - Custom fetch, headers, retries, caching, and more
- 🎨 **Clean Code** - Linted with BiomeJS for consistent code quality
- ✨ **Auto-Parsing** - Automatically parses JSON string fields (outcomes, prices, token IDs)

## Installation

```bash
npm install polymarket-gamma
```

```bash
yarn add polymarket-gamma
```

```bash
pnpm add polymarket-gamma
```

```bash
bun add polymarket-gamma
```

## Quick Start

```typescript
import { PolymarketGammaClient } from 'polymarket-gamma';

// Create a new client
const client = new PolymarketGammaClient();

// Get a market by slug
const market = await client.getMarket('will-btc-hit-100k-by-2024');
console.log(market.question);
console.log(market.outcomes);       // Automatically parsed: ['Yes', 'No']
console.log(market.outcome_prices); // Automatically parsed: ['0.5', '0.5']

// Get active markets
const markets = await client.getMarkets({ active: true, limit: 10 });

// Search for events
const results = await client.search({ query: 'election', limit: 5 });
```

## API Reference

### Client Configuration

```typescript
const client = new PolymarketGammaClient({
  baseUrl: 'https://gamma-api.polymarket.com', // optional, default shown
  timeout: 30000, // optional, in milliseconds
  headers: {
    // optional, custom headers for all requests
    'X-API-Key': 'your-key',
    'User-Agent': 'MyApp/1.0',
  },
  fetch: customFetchFn, // optional, custom fetch implementation
});
```

**Customization Options:**
- `baseUrl` - Override the API base URL
- `timeout` - Request timeout in milliseconds (default: 30000)
- `headers` - Custom headers added to all requests
- `fetch` - Custom fetch implementation for logging, retries, caching, etc.

**Custom Fetch Example:**
```typescript
// Add request logging
const loggingFetch = async (url, init) => {
  console.log(`Request: ${init?.method || 'GET'} ${url}`);
  return fetch(url, init);
};

const client = new PolymarketGammaClient({
  fetch: loggingFetch as typeof fetch,
});
```

See [examples/custom-client.ts](./examples/custom-client.ts) for more advanced examples including retries, caching, and rate limiting.

### Markets

```typescript
// Get a specific market by ID or slug
const market = await client.getMarket('market-id-or-slug');

// Get markets with filters
const markets = await client.getMarkets({
  active: true,
  closed: false,
  archived: false,
  featured: true,
  tags: ['politics', 'us-elections'],
  category: 'politics',
  limit: 20,
  offset: 0,
  order_by: 'volume', // 'liquidity' | 'volume' | 'created_at' | 'end_date'
  ascending: false,
});

// Get tags for a market
const tags = await client.getMarketTags('market-id');
```

### Events

```typescript
// Get a specific event by ID or slug
const event = await client.getEvent('event-id-or-slug');

// Get events with filters
const events = await client.getEvents({
  active: true,
  closed: false,
  tags: ['sports'],
  limit: 10,
  offset: 0,
});

// Get events with pagination metadata
const paginatedEvents = await client.getEventsPaginated({
  active: true,
  archived: false,
  closed: false,
  order: 'startDate',
  ascending: false,
  limit: 10,
  offset: 0,
});
console.log(paginatedEvents.data); // Array of events
console.log(paginatedEvents.pagination.hasMore); // true/false
console.log(paginatedEvents.pagination.totalResults); // Total count

// Get tags for an event
const tags = await client.getEventTags('event-id');
```

### Search

```typescript
// Search across events, tags, and profiles
const results = await client.search({
  query: 'bitcoin',
  limit: 10,
  offset: 0,
});

console.log(results.events);
console.log(results.tags);
console.log(results.profiles);
```

### Tags

```typescript
// Get all tags
const tags = await client.getTags({ limit: 50, offset: 0 });

// Get a specific tag
const tag = await client.getTag('tag-id-or-slug');

// Get related tags
const relatedTags = await client.getRelatedTags('tag-id-or-slug');
```

### Sports

```typescript
// Get all teams
const teams = await client.getTeams({ limit: 50 });

// Get all sports
const sports = await client.getSports();
```

### Series

```typescript
// Get all series
const series = await client.getSeries({ limit: 10 });

// Get a specific series
const seriesDetail = await client.getSeriesById('series-id');
```

### Comments

```typescript
// Get all comments
const comments = await client.getComments({ limit: 20, offset: 0 });

// Get a specific comment
const comment = await client.getComment('comment-id');

// Get comments by user
const userComments = await client.getCommentsByUser('0x123...', { limit: 10 });
```

### Grok AI Features

```typescript
// Get AI-powered event summary
const summary = await client.grokEventSummary('event-slug');

// Get AI-powered market explanation
const explanation = await client.grokElectionMarketExplanation('market-slug');
```

## Examples

Check out the [examples directory](./examples) for more detailed usage examples:

- [basic-usage.ts](./examples/basic-usage.ts) - Basic API usage
- [advanced-usage.ts](./examples/advanced-usage.ts) - Advanced features and patterns
- [custom-client.ts](./examples/custom-client.ts) - Custom fetch, headers, retries, caching

## Type Definitions

The package includes comprehensive TypeScript type definitions for all API responses:

- `GammaMarket` - Market data
- `Event` - Event information
- `Tag` - Tag data
- `Series` - Series/tournament data
- `Team` - Sports team data
- `Sport` - Sport data
- `Comment` - Comment data
- `Profile` - User profile data
- And more...

## Development

```bash
# Install dependencies
npm install

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type check
npm run check

# Build
npm run build
```

## Testing

This package includes comprehensive unit tests using Vitest. Tests cover:

- ✅ All API methods (markets, events, tags, series, sports, comments)
- ✅ Request parameter handling (filters, pagination, arrays)
- ✅ Error handling (HTTP errors, timeouts, network failures)
- ✅ Grok AI features
- ✅ URL construction and query parameters
- ✅ Automatic parsing of JSON string fields

**Test Coverage:** 37 tests, all passing

Run tests with:
```bash
npm run test              # Run tests once
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Run tests with coverage report
```

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Related Projects

- [polymarket-apis](https://github.com/qualiaenjoyer/polymarket-apis) - Python client that inspired this project
- [Polymarket Documentation](https://docs.polymarket.com/)

## Disclaimer

This is an unofficial client library for the Polymarket Gamma API. It is not affiliated with or endorsed by Polymarket.

## Links

- [NPM Package](https://www.npmjs.com/package/polymarket-gamma)
- [GitHub Repository](https://github.com/0xjord4n/polymarket-gamma)
- [Issue Tracker](https://github.com/0xjord4n/polymarket-gamma/issues)
- [Polymarket](https://polymarket.com/)
- [Polymarket Docs](https://docs.polymarket.com/)
