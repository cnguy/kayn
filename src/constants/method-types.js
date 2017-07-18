const LOL = '/lol/'
const V3 = '/v3/'

const CHAMPION_MASTERY = `${LOL}champion-mastery${V3}`
const LIST_CHAMPION_MASTERIES = `${CHAMPION_MASTERY}champion-masteries/by-summoner/{summonerId}`
const GET_CHAMPION_MASTERY = `${CHAMPION_MASTERY}/lol/champion-mastery/v3/champion-masteries/by-summoner/{summonerId}/by-champion/{championId}`
const GET_TOTAL_CHAMPION_MASTERY_SCORE = `${CHAMPION_MASTERY}/lol/champion-mastery/v3/scores/by-summoner/{summonerId}`

const CHAMPION = `${LOL}platform${V3}`
const LIST_CHAMPIONS = `${CHAMPION}champions`
const GET_CHAMPION = `${CHAMPION}champions/{id}`

const LEAGUE = `${LOL}league${V3}`
const GET_CHALLENGER_LEAGUE = `${LEAGUE}challengerleagues/by-queue/{queue}`
const GET_LEAGUES_IN_ALL_QUEUES = `${LEAGUE}leagues/by-summoner/{summonerId}`
const GET_MASTER_LEAGUE = `${LEAGUE}masterleagues/by-queue/{queue}`
const GET_LEAGUE_POSITIONS_IN_ALL_QUEUES = `${LEAGUE}positions/by-summoner/{summonerId}`

const STATUS = `${LOL}status${V3}`
const GET_SHARD_STATUS = `${STATUS}/shard-data`

const MASTERIES = `${LOL}platform${V3}`
const GET_MASTERY_PAGES = `${MASTERIES}masteries/by-summoner/{summonerId}`

const MATCH = `${LOL}match${V3}`
const GET_MATCH = `${MATCH}matches/{matchId}`
const GET_MATCHLIST = `${MATCH}matchlists/by-account/{accountId}`
const GET_RECENT_MATCHLIST = `${MATCH}matchlists/by-account/{accountId}/recent`
const GET_MATCH_TIMELINE = `${MATCH}timelines/by-match/{matchId}`

const RUNES = `${LOL}platform${V3}`
const GET_RUNE_PAGES = `${RUNES}runes/by-summoner/{summonerId}`

const SPECTATOR = `${LOL}spectator${V3}`
const GET_CURRENT_GAME = `${SPECTATOR}active-games/by-summoner/{summonerId}`
const LIST_FEATURED_GAMES = `${SPECTATOR}featured-games`

const SUMMONER = `${LOL}summoner${V3}`
const GET_SUMMONER_BY_ACCOUNT_ID = `${SUMMONER}summoners/by-account/{accountId}`
const GET_SUMMONER_BY_NAME = `${SUMMONER}summoners/by-name/{summonerName}`
const GET_SUMMONER_BY_ID = `${SUMMONER}summoners/{summonerId}`

const methodTypes = {
  LIST_CHAMPION_MASTERIES,
  GET_CHAMPION_MASTERY,
  GET_TOTAL_CHAMPION_MASTERY_SCORE,
  LIST_CHAMPIONS,
  GET_CHAMPION,
  GET_CHALLENGER_LEAGUE,
  GET_LEAGUES_IN_ALL_QUEUES,
  GET_MASTER_LEAGUE,
  GET_LEAGUE_POSITIONS_IN_ALL_QUEUES,
  GET_SHARD_STATUS,
  GET_MASTERY_PAGES,
  GET_MATCH,
  GET_MATCHLIST,
  GET_RECENT_MATCHLIST,
  GET_MATCH_TIMELINE,
  GET_RUNE_PAGES,
  GET_CURRENT_GAME,
  LIST_FEATURED_GAMES,
  GET_SUMMONER_BY_ACCOUNT_ID,
  GET_SUMMONER_BY_NAME,
  GET_SUMMONER_BY_ID
}

export default methodTypes
