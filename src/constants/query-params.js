// This file maps endpoints to hard-coded string constants.
// This is used to verify that the user is passing in the options
// they desire. API endpoints do not throw errors when extra query parameters
// or misspelled parameters are passed in.
// Typos or the wrong type of options are common mistakes, so this
// should help a lot.
//
// eg: runeListData instead of runeData for grabbing a single rune.

// TODO: champListData, itemListData and what not will become `tags` in the future

// Might add type-checking in the future
const VERSION = 'version' // string
const LOCALE = 'locale' // string
const DATA_BY_ID = 'dataById' // boolean
// CHAMPION-MASTERY-V3 N/A
// CHAMPION-V3
  // all champs
    // freeToPlay
const FREE_TO_PLAY = 'freeToPlay' // boolean
// LEAGUE-V3 NONE
// STATUS-V3 NONE
// MASTERIES-V3 NONE
// MATCH-V3
  // GET MATCH BY ID
const FOR_ACCOUNT_ID = 'forAccountId'
const FOR_PLATFORM_ID = 'forPlatformId'
  // MATCHLIST BY ACCOUNT
const QUEUE = 'queue' // Set[int]
const BEGIN_TIME = 'beginTime' // int
const END_INDEX = 'endIndex' // int
const SEASON = 'season' // Set[int]
const CHAMPION = 'champion' // Set[int]
const BEGIN_INDEX = 'beginIndex' // int
const END_TIME = 'endTime' // long
// STATIC-V3
  // ALL CHAMPIONS
// VERSION
// LOCALE
const CHAMP_LIST_DATA = 'tags' // string
  // SINGLE CHAMPION
// VERSION
// LOCALE
const CHAMP_DATA = 'tags' // string
  // ALL ITEMS
// VERSION
// LOCALE
const ITEM_LIST_DATA = 'tags' // string
  // SINGLE ITEM
// VERSION
// LOCALE
const ITEM_DATA = 'tags' // string
  // LANGUAGE STRINGS
// VERSION
// LOCALE
  // LANGUAGES | NONE
  // MAP
// VERSION
// LOCALE
  // MASTERIES
// VERSION
// LOCALE
const MASTERY_LIST_DATA = 'tags' // string
  // SINGLE MASTERY
// VERSION
// LOCALE
const MASTERY_DATA = 'tags' // string
  // PROFILE ICONS
// VERSION
// LOCALE
  // REALMS | NONE
  // RUNES
// VERSION
// LOCALE
const RUNE_LIST_DATA = 'tags' // string
  // SINGLE RUNE
// VERSION
// LOCALE
const RUNE_DATA = 'tags' // string
  // SUMMONER SPELLS ILST
// VERSION
// LOCALE
// dataById
const SPELL_LIST_DATA = 'tags' // string
  // SUMMONER SPELL
// VERSION
// LOCALE
const SPELL_DATA = 'tags' // string
  // VERSIONS NONE

// helper constant
const VERSION_AND_LOCALE = [VERSION, LOCALE]

const queryParams = {
  NONE: [],
  CHAMPION: {
    LIST: [FREE_TO_PLAY]
  },
  STATIC: {
    CHAMPION: {
      LIST: [...VERSION_AND_LOCALE, DATA_BY_ID, CHAMP_LIST_DATA],
      ONE: [...VERSION_AND_LOCALE, CHAMP_DATA]
    },
    ITEM: {
      LIST: [...VERSION_AND_LOCALE, ITEM_LIST_DATA],
      ONE: [...VERSION_AND_LOCALE, ITEM_DATA]
    },
    LANGUAGE_STRING: {
      LIST: [...VERSION_AND_LOCALE]
    },
    MAP: {
      LIST: [...VERSION_AND_LOCALE]
    },
    MASTERY: {
      LIST: [...VERSION_AND_LOCALE, MASTERY_LIST_DATA],
      ONE: [...VERSION_AND_LOCALE, MASTERY_DATA]
    },
    PROFILE_ICON: {
      LIST: [...VERSION_AND_LOCALE]
    },
    RUNE: {
      LIST: [...VERSION_AND_LOCALE, RUNE_LIST_DATA],
      ONE: [...VERSION_AND_LOCALE, RUNE_DATA]
    },
    SUMMONER_SPELL: {
      LIST: [...VERSION_AND_LOCALE, DATA_BY_ID, SPELL_LIST_DATA],
      ONE: [...VERSION_AND_LOCALE, SPELL_DATA]
    }
  },
  MATCH: {
    GET: [
      FOR_ACCOUNT_ID, FOR_PLATFORM_ID
    ]
  },
  MATCHLIST: {
    GET: [
      QUEUE, BEGIN_TIME, END_INDEX, SEASON, CHAMPION, BEGIN_INDEX, END_TIME
    ]
  }
}

export default queryParams