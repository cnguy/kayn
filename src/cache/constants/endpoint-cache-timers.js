import cacheTimers from './cache-timers'

const endpointCacheTimers = {
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
  MATCH_LIST: cacheTimers.ONE_HOUR,
  RUNES_MASTERIES: cacheTimers.WEEK,
  STATS: cacheTimers.HOUR,
  SUMMONER: cacheTimers.DAY
}

export default endpointCacheTimers