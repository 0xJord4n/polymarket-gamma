/**
 * Basic usage examples for Polymarket Gamma API Client
 */

import { PolymarketGammaClient } from '../src';

// Create a new client instance
const client = new PolymarketGammaClient();

// Example 1: Get a specific market by slug
async function getMarketExample() {
  try {
    const market = await client.getMarket('will-btc-hit-100k-by-2024');
    console.log('Market:', market.question);
    console.log('Active:', market.active);
    console.log('Volume:', market.volume);
  } catch (error) {
    console.error('Error fetching market:', error);
  }
}

// Example 2: Get all active markets
async function getActiveMarketsExample() {
  try {
    const markets = await client.getMarkets({
      active: true,
      limit: 10,
      offset: 0,
    });
    console.log(`Found ${markets.length} active markets`);
    for (const market of markets) {
      console.log(`- ${market.question}`);
    }
  } catch (error) {
    console.error('Error fetching markets:', error);
  }
}

// Example 3: Search for events
async function searchExample() {
  try {
    const results = await client.search({
      query: 'election',
      limit: 5,
    });
    console.log('Search results:');
    console.log('Events:', results.events?.length ?? 0);
    console.log('Tags:', results.tags?.length ?? 0);
  } catch (error) {
    console.error('Error searching:', error);
  }
}

// Example 4: Get event details
async function getEventExample() {
  try {
    const event = await client.getEvent('2024-presidential-election');
    console.log('Event:', event.title);
    console.log('Markets:', event.markets?.length ?? 0);
    console.log('Volume:', event.volume);
  } catch (error) {
    console.error('Error fetching event:', error);
  }
}

// Example 5: Get tags
async function getTagsExample() {
  try {
    const tags = await client.getTags({ limit: 20 });
    console.log('Available tags:');
    for (const tag of tags) {
      console.log(`- ${tag.label} (${tag.slug})`);
    }
  } catch (error) {
    console.error('Error fetching tags:', error);
  }
}

// Example 6: Get markets by category
async function getMarketsByCategoryExample() {
  try {
    const markets = await client.getMarkets({
      category: 'politics',
      active: true,
      limit: 10,
    });
    console.log(`Found ${markets.length} active politics markets`);
  } catch (error) {
    console.error('Error fetching markets:', error);
  }
}

// Run examples
async function _main() {
  console.log('=== Polymarket Gamma API Examples ===\n');

  await getMarketExample();
  console.log('\n---\n');

  await getActiveMarketsExample();
  console.log('\n---\n');

  await searchExample();
  console.log('\n---\n');

  await getEventExample();
  console.log('\n---\n');

  await getTagsExample();
  console.log('\n---\n');

  await getMarketsByCategoryExample();
}

// Uncomment to run
// main().catch(console.error);
