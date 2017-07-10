// @flow

import cacheTimers from './cache-timers'

const endpointCacheTimers: {
  CHAMPION: number,
  CHAMPION_MASTERY: number,
  CURRENT_GAME: number,
  FEATURED_GAMES: number,
  GAME: number,
  LEAGUE: number,
  STATIC: number,
  STATUS: number,
  MATCH: number,
  MATCHLIST: number,
  RUNES_MASTERIES: number,
  SPECTATOR: number,
  STATS: number,
  SUMMONER: number,
  TOURNAMENT_STUB: number,
  TOURNAMENT: number,
} = {
  // defaults
  CHAMPION: cacheTimers.MONTH,
  CHAMPION_MASTERY: cacheTimers.SIX_HOURS,
  CURRENT_GAME: cacheTimers.NONE,
  FEATURED_GAMES: cacheTimers.NONE,
  GAME: cacheTimers.HOUR,
  LEAGUE: cacheTimers.SIX_HOURS,
  STATIC: cacheTimers.MONTH,
  STATUS: cacheTimers.NONE,
  MATCH: cacheTimers.MONTH,
  MATCHLIST: cacheTimers.HOUR,
  RUNES_MASTERIES: cacheTimers.WEEK,
  SPECTATOR: cacheTimers.NONE,
  STATS: cacheTimers.HOUR,
  SUMMONER: cacheTimers.DAY,
  TOURNAMENT_STUB: cacheTimers.HOUR, // TODO: ??
  TOURNAMENT: cacheTimers.HOUR // TODO: ??
}

export default endpointCacheTimers