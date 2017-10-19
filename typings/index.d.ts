declare class Kayn {
    public ChampionMastery: {
        list: (summonerID: number) => KaynRequest<any>;
        get: (summonerID: number) => (championID: number) => KaynRequest<any>;
        totalScore: (summonerID: number) => KaynRequest<any>;
    }

    public Champion: {
        list: () => KaynRequest<any>;
        get: (summonerID: number) => KaynRequest<any>;
    }

    public Challenger: {
        list: (queueName: queueName) => KaynRequest<any>;
    }
    
    public Leagues: {
        by: {
            summonerID: (summonerID: number) => KaynRequest<any>;
        }
    }

    public League: {
        by: {
            id: (leagueID: number) => KaynRequest<any>;
        }
    }

    public Master: {
        list: (queueName: queueName) => KaynRequest<any>;
    }

    public LeaguePositions: {
        by: {
            summonerID: (summonerID: number) => KaynRequest<any>;
        }
    }

    public Static: {
        Champion: {
            list: () => KaynRequest<any>;
            get: (championID: number) => KaynRequest<any>;
        }
        Item: {
            list: () => KaynRequest<any>;
            get: (itemID: number) => KaynRequest<any>;
        }
        LanguageString: {
            list: () => KaynRequest<any>;
        }
        Language: {
            list: () => KaynRequest<any>;
        }
        Map: {
            get: () => KaynRequest<any>;
        }
        Mastery: {
            list: () => KaynRequest<any>;
            get: (masteryID: number) => KaynRequest<any>;
        }
        ProfileIcon: {
            list: () => KaynRequest<any>;
        }
        Realm: {
            get: () => KaynRequest<any>;
        }
        Rune: {
            list: () => KaynRequest<any>;
            get: (runeID: number) => KaynRequest<any>;
        }
        SummonerSpell: {
            list: () => KaynRequest<any>;
            get: (summonerSpellID: number) => KaynRequest<any>;
        }
        Version: {
            list: () => KaynRequest<any>;
        }
    }

    public Status: {
        get: () => KaynRequest<any>;
    }

    public Masteries: {
        by: {
            summonerID: (summonerID: number) => KaynRequest<any>;
        }
    }

    public Match: {
        get: (matchID: number) => KaynRequest<any>;
        timeline: (matchID: number) => KaynRequest<any>;
    }

    public Matchlist: {
        by: {
            accountID: (accountID: number) => KaynRequest<any>;
        }
        Recent: {
            by: {
                accountID: (accountID: number) => KaynRequest<any>;
            }
        }
    }

    public Runes: {
        by: {
            summonerID: (summonerID: number) => KaynRequest<any>;
        }
    }

    public Summoner: {
        by: {
            name: (name: string) => KaynRequest<Summoner>,
            id: (id: number) => KaynRequest<Summoner>,
            accountID: (accountID: number) => KaynRequest<Summoner>,
        }
    }
}

type Summoner = {
    id: number;
    accountId: number;
    name: string;
    profileIconId: number;
    revisionDate: number;
    summonerLevel: number;
}

declare class KaynRequest<T> {
    region(region: region): KaynRequest<T>;
    query(query: Object): KaynRequest<T>;
    then(resolve: (data: T) => void, reject?: (err: any) => void): KaynRequest<T>;
    catch(callback: (err: any) => void): void;
    callback(callback: callback<T>): void;
}

type callback<T> = (err: any, data: T) => void;

// a lot of these are temp and will be improved in later releases.
type serviceName = string;
type methodName = string;
type endpoint = string;
interface KaynConfig {
    region?: region;
    debugOptions?: {
        isEnabled?: boolean;
        showKey?: boolean;
    }
    requestOptions?: {
        shouldRetry?: boolean;
        numberOfRetriesBeforeAbort?: number;
        delayBeforeRetry?: number;
    }
}
type httpMethodType = string;
  
type region = string;
type queueName = string;

declare module 'kayn' {
    export function Kayn(key?: string): (config: KaynConfig) => Kayn;

    class BasicJSCache {
        constructor();
    }

    class RedisCache {
        constructor(opts?: {
            host?: string,
            port?: number,
            keyPrefix?: string,
        })
    }

    enum REGIONS {
        BRAZIL = 'br',
        EUROPE = 'eune',
        EUROPE_WEST = 'euw',
        KOREA = 'kr',
        LATIN_AMERICA_NORTH = 'lan',
        LATIN_AMERICA_SOUTH = 'las',
        NORTH_AMERICA = 'na',
        OCEANIA = 'oce',
        RUSSIA = 'ru',
        TURKEY = 'tr',
        JAPAN = 'jp',
    }

    export interface METHOD_NAMES {
        CHAMPION_MASTERY: {
            GET_ALL_CHAMPION_MASTERIES: 'CHAMPION_MASTERY.GET_ALL_CHAMPION_MASTERIES',
            GET_CHAMPION_MASTERY: 'CHAMPION_MASTERY.GET_CHAMPION_MASTERY',
            GET_CHAMPION_MASTERY_SCORE: 'GET_CHAMPION_MASTERY_SCORE',
        },

        CHAMPION: {
            GET_CHAMPIONS: 'CHAMPION.GET_CHAMPIONS',
            GET_CHAMPION_BY_ID: 'CHAMPION.GET_CHAMPION_BY_ID',
        },

        LEAGUE: {
            GET_CHALLENGER_LEAGUE: 'LEAGUE.GET_CHALLENGER_LEAGUE',
            GET_ALL_LEAGUES_FOR_SUMMONER: 'LEAGUE.GET_ALL_LEAGUES_FOR_SUMMONER',
            GET_LEAGUE_BY_ID: 'LEAGUE.GET_BY_ID',
            GET_MASTER_LEAGUE: 'LEAGUE.GET_MASTER_LEAGUE',
            GET_ALL_LEAGUE_POSITIONS_FOR_SUMMONER:
              'LEAGUE.GET_ALL_LEAGUE_POSITIONS_FOR_SUMMONER',
        },

        STATIC: {
            GET_CHAMPION_LIST: 'STATIC.GET_CHAMPION_LIST',
            GET_CHAMPION_BY_ID: 'STATIC.GET_CHAMPION_BY_ID',
            GET_ITEM_LIST: 'STATIC.GET_ITEM_LIST',
            GET_ITEM_BY_ID: 'STATIC.GET_ITEM_BY_ID',
            GET_LANGUAGE_STRINGS: 'STATIC.GET_LANGUAGE_STRINGS',
            GET_LANGUAGES: 'STATIC.GET_LANGUAGES',
            GET_MAP_DATA: 'STATIC.GET_MAP_DATA',
            GET_MASTERY_LIST: 'STATIC.GET_MASTERY_LIST',
            GET_MASTERY_BY_ID: 'STATIC.GET_MASTERY_BY_ID',
            GET_PROFILE_ICONS: 'STATIC.GET_PROFILE_ICONS',
            GET_REALM: 'STATIC.GET_REALM',
            GET_RUNE_LIST: 'STATIC.GET_RUNE_LIST',
            GET_RUNE_BY_ID: 'STATIC.GET_RUNE_BY_ID',
            GET_SUMMONER_SPELL_LIST: 'STATIC.GET_SUMMONER_SPELL_LIST',
            GET_SUMMONER_SPELL_BY_ID: 'STATIC.GET_SUMMONER_SPELL_BY_ID',
            GET_VERSIONS: 'STATIC.GET_VERSIONS',
        },

        LOL_STATUS:  {
            GET_SHARD_DATA: 'LOL_STATUS.GET_SHARD_DATA',
        },

        MASTERIES: {
            GET_MASTERY_PAGES_BY_SUMMONER_ID:
              'MASTERIES.GET_MASTERY_PAGES_BY_SUMMONER_ID',
        },

        MATCH: {
            GET_MATCH: 'MATCH.GET_MATCH',
            GET_MATCHLIST: 'MATCH.GET_MATCHLIST',
            GET_RECENT_MATCHLIST: 'MATCH.GET_RECENT_MATCHLIST',
            GET_MATCH_TIMELINE: 'MATCH.GET_MATCH_TIMELINE',
        },

        RUNES: {
            GET_RUNE_PAGES_BY_SUMMONER_ID: 'RUNES.GET_RUNE_PAGES_BY_SUMMONER_ID',
        },

        SPECTATOR: {
            GET_CURRENT_GAME_INFO_BY_SUMMONER:
              'SPECTATOR.GET_CURRENT_GAME_INFO_BY_SUMMONER',
            GET_FEATURED_GAMES: 'SPECTATOR.GET_FEATURED_GAMES',
        },

        SUMMONER: {
            GET_BY_ACCOUNT_ID: 'SUMMONER.GET_BY_ACCOUNT_ID',
            GET_BY_SUMMONER_NAME: 'SUMMONER.GET_BY_SUMMONER_NAME',
            GET_BY_SUMMONER_ID: 'SUMMONER.GET_BY_SUMMONER_ID',
        },
    }

}
