/**
 * TypeScript type definitions for Polymarket Gamma API
 * Based on the Python Pydantic models from polymarket-apis
 */

/**
 * Represents a prediction market on Polymarket
 */
export interface GammaMarket {
  id?: string;
  condition_id?: string;
  question_id?: string;
  slug?: string;
  question?: string;
  twitter_card_image?: string;
  resolution_source?: string;
  end_date?: string;
  category?: string;
  amm_type?: string;
  liquidity?: number;
  sponsor_name?: string;
  sponsor_image?: string;
  start_date?: string;
  x_axis_value?: string;
  y_axis_value?: string;
  denomination_token?: string;
  fee?: string;
  image?: string;
  icon?: string;
  lower_bound?: string;
  upper_bound?: string;
  description?: string;
  outcomes?: string[];
  outcome_prices?: string[];
  volume?: string;
  active?: boolean;
  market_type?: string;
  format_type?: string;
  lower_bound_date?: string;
  upper_bound_date?: string;
  closed?: boolean;
  market_maker_address?: string;
  created_by?: number;
  updated_by?: number;
  created_at?: string;
  updated_at?: string;
  closed_time?: string;
  wide_format?: boolean;
  new?: boolean;
  mailchimp_tag?: string;
  featured?: boolean;
  archived?: boolean;
  resolved_by?: string;
  restricted?: boolean;
  market_group?: number;
  group_item_title?: string;
  group_item_threshold?: string;
  uma_end_date?: string;
  seconds_delay?: number;
  notification_policy?: number;
  pager_duty_notification_enabled?: boolean;
  reward_pool?: number;
  reward_epoch?: number;
  reward_multiplier?: number;
  reward_min_size?: number;
  reward_max_spread?: number;
  ready?: boolean;
  enable_order_book?: boolean;
  notification_type?: string;
  uma_reward?: string;
  question_title?: string;
  enable_ask?: boolean;
  notifications?: number[];
  events?: Event[];
  markets?: GammaMarket[];
  clob_token_ids?: string[];
  clobRewards?: ClobReward[];
  tags?: Tag[];
  cyom?: boolean;
  competitive?: number;
  neg_risk?: boolean;
  neg_risk_market_id?: string;
  neg_risk_request_id?: string;
  accepting_orders?: boolean;
  accepting_order_timestamp?: string;
  minimum_order_size?: number;
  minimum_tick_size?: number;
  taker_fee_bps?: number;
  maker_fee_bps?: number;
  minimum_tick_size_usd?: number;
  maker_base_fee?: number;
  taker_base_fee?: number;
  best_bid?: string;
  best_ask?: string;
  spread?: number;
  spread_percent?: number;
  volume_24hr?: string;
  volume_num_trades_24hr?: number;
  last_trade_price?: string;
  last_trade_time?: string;
  open_interest?: string;
  rewards_daily_rate?: number;
  rewards_min_size?: number;
  rewards_max_spread?: number;
  seconds_delay_requested?: number;
  auto_update_schema?: boolean;
  active_trading_prompt?: boolean;
}

/**
 * Represents an event that contains one or more markets
 */
export interface Event {
  id?: string;
  slug?: string;
  title?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  image?: string;
  icon?: string;
  created_at?: string;
  updated_at?: string;
  archived?: boolean;
  active?: boolean;
  closed?: boolean;
  restricted?: boolean;
  liquidity?: number;
  volume?: string;
  markets?: GammaMarket[];
  tags?: Tag[];
  categories?: Category[];
  series?: Series[];
  comment_count?: number;
  enable_comment?: boolean;
  ticker?: string;
}

/**
 * Represents a series or tournament of related events
 */
export interface Series {
  id?: string;
  slug?: string;
  title?: string;
  description?: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
  events?: Event[];
  categories?: Category[];
}

/**
 * Represents a category for organizing markets and events
 */
export interface Category {
  id?: string;
  label?: string;
  slug?: string;
}

/**
 * Represents a tag for organizing and filtering content
 */
export interface Tag {
  id?: string;
  label?: string;
  slug?: string;
  description?: string;
  event_count?: number;
  market_count?: number;
  parent_id?: string;
  children?: Tag[];
}

/**
 * Represents a user profile
 */
export interface Profile {
  id?: string;
  name?: string;
  username?: string;
  avatar_url?: string;
  bio?: string;
}

/**
 * Represents a comment on a market or event
 */
export interface Comment {
  id?: string;
  market_id?: string;
  event_id?: string;
  user?: Profile;
  content?: string;
  created_at?: string;
  updated_at?: string;
  parent_id?: string;
  reactions?: Reaction[];
  reply_count?: number;
}

/**
 * Represents a reaction to a comment
 */
export interface Reaction {
  id?: string;
  comment_id?: string;
  user?: Profile;
  type?: string;
  created_at?: string;
}

/**
 * Represents a sports team
 */
export interface Team {
  id?: string;
  name?: string;
  short_name?: string;
  abbreviation?: string;
  logo?: string;
  sport_id?: string;
  sport?: Sport;
}

/**
 * Represents a sport
 */
export interface Sport {
  id?: string;
  name?: string;
  slug?: string;
}

/**
 * Represents a CLOB (Central Limit Order Book) reward
 */
export interface ClobReward {
  id?: string;
  market_id?: string;
  event_id?: string;
  reward_epoch?: number;
  asset_address?: string;
  reward_amount?: string;
  start_date?: string;
  end_date?: string;
}

/**
 * Represents a collection of markets
 */
export interface Collection {
  id?: string;
  title?: string;
  slug?: string;
  description?: string;
  markets?: GammaMarket[];
}

/**
 * Represents a market creator
 */
export interface Creator {
  id?: string;
  name?: string;
  avatar_url?: string;
}

/**
 * Search results wrapper
 */
export interface SearchResults {
  events?: Event[];
  tags?: Tag[];
  profiles?: Profile[];
}

/**
 * Pagination parameters for list queries
 */
export interface PaginationParams {
  limit?: number;
  offset?: number;
  [key: string]: unknown;
}

/**
 * Filter parameters for markets
 */
export interface MarketFilters extends PaginationParams {
  active?: boolean;
  closed?: boolean;
  archived?: boolean;
  featured?: boolean;
  restricted?: boolean;
  tags?: string[];
  category?: string;
  event_id?: string;
  order_by?: 'liquidity' | 'volume' | 'created_at' | 'end_date';
  ascending?: boolean;
}

/**
 * Filter parameters for events
 */
export interface EventFilters extends PaginationParams {
  active?: boolean;
  closed?: boolean;
  archived?: boolean;
  restricted?: boolean;
  tags?: string[];
  category?: string;
  series_id?: string;
  order_by?: 'liquidity' | 'volume' | 'created_at' | 'end_date';
  ascending?: boolean;
}

/**
 * Search parameters
 */
export interface SearchParams {
  query: string;
  limit?: number;
  offset?: number;
  [key: string]: unknown;
}
