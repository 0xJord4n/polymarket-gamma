/**
 * Advanced usage examples for Polymarket Gamma API Client
 */

import { PolymarketGammaClient } from '../src';

const client = new PolymarketGammaClient();

// Example 1: Get market with tags
async function getMarketWithTagsExample() {
  try {
    const marketId = '123456';
    const market = await client.getMarket(marketId);
    const tags = await client.getMarketTags(marketId);

    console.log(`Market: ${market.question}`);
    console.log('Tags:', tags.map((t) => t.label).join(', '));
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example 2: Get related tags
async function getRelatedTagsExample() {
  try {
    const tagSlug = 'us-elections';
    const relatedTags = await client.getRelatedTags(tagSlug);

    console.log(`Tags related to '${tagSlug}':`);
    for (const tag of relatedTags) {
      console.log(`- ${tag.label} (${tag.market_count} markets)`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example 3: Get sports markets
async function getSportsMarketsExample() {
  try {
    const sports = await client.getSports();
    const teams = await client.getTeams({ limit: 20 });

    console.log('Available sports:', sports.map((s) => s.name).join(', '));
    console.log(`\nFirst 20 teams:`);
    for (const team of teams) {
      console.log(`- ${team.name} (${team.abbreviation})`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example 4: Get series and events
async function getSeriesExample() {
  try {
    const allSeries = await client.getSeries({ limit: 10 });

    for (const series of allSeries) {
      console.log(`\nSeries: ${series.title}`);

      if (series.id) {
        const seriesDetail = await client.getSeriesById(series.id);
        console.log(`  Events: ${seriesDetail.events?.length ?? 0}`);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example 5: Get comments
async function getCommentsExample() {
  try {
    const comments = await client.getComments({ limit: 10 });

    console.log('Recent comments:');
    for (const comment of comments) {
      console.log(`- ${comment.user?.name}: ${comment.content?.substring(0, 50)}...`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example 6: Use Grok AI features
async function _grokAIExample() {
  try {
    // Get event summary
    const eventSummary = await client.grokEventSummary('2024-presidential-election');
    console.log('Event Summary:', eventSummary);

    // Get market explanation
    const explanation = await client.grokElectionMarketExplanation('will-trump-win-2024');
    console.log('\nMarket Explanation:', explanation);
  } catch (error) {
    console.error('Error with Grok AI:', error);
  }
}

// Example 7: Pagination and filtering
async function paginationExample() {
  try {
    const limit = 10;
    let offset = 0;
    const allMarkets = [];

    // Fetch first 30 markets in batches of 10
    for (let i = 0; i < 3; i++) {
      const markets = await client.getMarkets({
        active: true,
        limit,
        offset,
        order_by: 'volume',
        ascending: false,
      });

      allMarkets.push(...markets);
      offset += limit;

      console.log(`Fetched batch ${i + 1}: ${markets.length} markets`);
    }

    console.log(`\nTotal markets fetched: ${allMarkets.length}`);
    console.log('Top market by volume:', allMarkets[0]?.question);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example 8: Error handling with custom timeout
async function customConfigExample() {
  try {
    // Create client with custom configuration
    const customClient = new PolymarketGammaClient({
      timeout: 5000, // 5 second timeout
    });

    const markets = await customClient.getMarkets({ limit: 5 });
    console.log(`Fetched ${markets.length} markets with 5s timeout`);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Request timed out');
    } else {
      console.error('Error:', error);
    }
  }
}

// Run examples
async function _main() {
  console.log('=== Advanced Polymarket Gamma API Examples ===\n');

  await getMarketWithTagsExample();
  console.log('\n---\n');

  await getRelatedTagsExample();
  console.log('\n---\n');

  await getSportsMarketsExample();
  console.log('\n---\n');

  await getSeriesExample();
  console.log('\n---\n');

  await getCommentsExample();
  console.log('\n---\n');

  await paginationExample();
  console.log('\n---\n');

  await customConfigExample();
}

// Uncomment to run
// main().catch(console.error);
