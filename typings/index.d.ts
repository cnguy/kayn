import * as dtos from './dtos'

declare module 'kayn' {
    class KaynClass {
        flushCache(cb?: callback<'OK'>): Promise<'OK'>

        public ChampionMastery: {
            get: (
                summonerID: number,
            ) => (
                championID: number,
            ) => KaynRequest<dtos.ChampionMasteryV3ChampionMasteryDTO>
            list: (
                summonerID: number,
            ) => KaynRequest<dtos.ChampionMasteryV3ChampionMasteryDTO[]>
            totalScore: (summonerID: number) => KaynRequest<number>
        }

        public Champion: {
            get: (summonerID: number) => KaynRequest<dtos.ChampionV3ChampionDto>
            list: () => KaynRequest<dtos.ChampionV3ChampionListDto>
        }

        public Challenger: {
            list: (
                queueName: queueName,
            ) => KaynRequest<dtos.LeagueV3LeagueListDTO>
        }

        public CurrentGame: {
            by: {
                summonerID: (
                    summonerID: number,
                ) => KaynRequest<dtos.SpectatorV3CurrentGameInfo>
            }
        }

        public League: {
            by: {
                uuid: (
                    leagueUUID: string,
                ) => KaynRequest<dtos.LeagueV3LeagueListDTO>
            }
        }

        public Master: {
            list: (
                queueName: queueName,
            ) => KaynRequest<dtos.LeagueV3LeagueListDTO>
        }

        public LeaguePositions: {
            by: {
                summonerID: (
                    summonerID: number,
                ) => KaynRequest<dtos.LeagueV3LeaguePositionDTO[]>
            }
        }

        public Status: {
            get: () => KaynRequest<dtos.LolStatusV3ShardStatus>
        }

        public Match: {
            get: (matchID: number) => KaynRequest<dtos.MatchV3MatchDto>
            timeline: (
                matchID: number,
            ) => KaynRequest<dtos.MatchV3MatchTimelineDto>

            Tournament: {
                listMatchIDs: (tournamentCode: string) => KaynRequest<number[]>
                get: (
                    matchID: number,
                    tournamentCode: string,
                ) => KaynRequest<dtos.MatchV3MatchDto>
            }
        }

        public Matchlist: {
            by: {
                accountID: (
                    accountID: number,
                ) => KaynRequest<dtos.MatchV3MatchlistDto>
            }
            Recent: {
                by: {
                    accountID: (
                        accountID: number,
                    ) => KaynRequest<dtos.MatchV3MatchlistDto>
                }
            }
        }

        public Summoner: {
            by: {
                name: (name: string) => KaynRequest<dtos.SummonerV3SummonerDTO>
                id: (id: number) => KaynRequest<dtos.SummonerV3SummonerDTO>
                accountID: (
                    accountID: number,
                ) => KaynRequest<dtos.SummonerV3SummonerDTO>
            }
        }

        public ThirdPartyCode: {
            by: {
                summonerID: (id: number) => KaynRequest<string>
            }
        }

        public TournamentStub: {
            create: (
                tournamentID: number,
                body?: dtos.TournamentStubV3TournamentCodeParameters,
            ) => KaynRequest<string[]>
            lobbyEvents: (
                tournamentCode: string,
            ) => KaynRequest<dtos.TournamentStubV3LobbyEventDTOWrapper>
            registerProviderData: (
                region: string,
                callbackURL: string,
            ) => KaynRequest<number>
            register: (providerID: number, name?: string) => KaynRequest<number>
        }

        public Tournament: {
            create: (
                tournamentID: number,
                body?: dtos.TournamentV3TournamentCodeParameters,
            ) => KaynRequest<string[]>
            update: (
                tournamentCode: string,
                body: dtos.TournamentV3TournamentCodeUpdateParameters,
            ) => KaynRequest<void>
            get: (
                tournamentCode: string,
            ) => KaynRequest<dtos.TournamentV3TournamentCodeDTO>
            lobbyEvents: (
                tournamentCode: string,
            ) => KaynRequest<dtos.TournamentV3LobbyEventDTOWrapper>
            registerProviderData: (
                region: string,
                callbackURL: string,
            ) => KaynRequest<number>
            register: (providerID: number, name?: string) => KaynRequest<number>
        }
    }

    type KaynError = {
        statusCode: number
        url: string
        error: any
    }

    class KaynRequest<T> {
        region(region: region): KaynRequest<T>
        query(query: Object): KaynRequest<T>
        then(
            resolve: (data: T) => void,
            reject?: (err: KaynError) => void,
        ): KaynRequest<T>
        catch(callback: (err: KaynError) => void): void
        callback(callback: callback<T>): void
    }

    type callback<T> = (err: KaynError, data: T) => void

    // a lot of these are temp and will be improved in later releases.
    type serviceName = string
    type methodName = string
    type endpoint = string
    interface KaynConfig {
        region?: region
        debugOptions?: {
            isEnabled?: boolean
            showKey?: boolean
        }
        requestOptions?: {
            shouldRetry?: boolean
            numberOfRetriesBeforeAbort?: number
            delayBeforeRetry?: number
            burst?: boolean
            shouldExitOn403?: boolean
        }
        cacheOptions?: {
            cache: any
            timeToLives?: {
                useDefault?: boolean
                byMethod?: any
                byGroup?: any
            }
        }
    }

    type region = string
    type queueName = string
    export function Kayn(key?: string): (config?: KaynConfig) => KaynClass

    class BasicJSCache {
        constructor()
    }

    class LRUCache {
        constructor(opts?: {
            max?: number
            length?: (value: any, key: any) => number
            dispose?: (key: any, value: any) => void
        })
    }

    class RedisCache {
        constructor(opts?: {
            host?: string
            port?: number
            keyPrefix?: string
            password?: string
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

    export namespace METHOD_NAMES {
        namespace CHAMPION_MASTERY {
            const GET_ALL_CHAMPION_MASTERIES =
                'CHAMPION_MASTERY.GET_ALL_CHAMPION_MASTERIES'
            const GET_CHAMPION_MASTERY = 'CHAMPION_MASTERY.GET_CHAMPION_MASTERY'
            const GET_CHAMPION_MASTERY_SCORE = 'GET_CHAMPION_MASTERY_SCORE'
        }

        namespace CHAMPION {
            const GET_CHAMPIONS = 'CHAMPION.GET_CHAMPIONS'
            const GET_CHAMPION_BY_ID = 'CHAMPION.GET_CHAMPION_BY_ID'
        }

        namespace LEAGUE {
            const GET_CHALLENGER_LEAGUE = 'LEAGUE.GET_CHALLENGER_LEAGUE'
            const GET_ALL_LEAGUES_FOR_SUMMONER =
                'LEAGUE.GET_ALL_LEAGUES_FOR_SUMMONER'
            const GET_LEAGUE_BY_ID = 'LEAGUE.GET_BY_ID'
            const GET_MASTER_LEAGUE = 'LEAGUE.GET_MASTER_LEAGUE'
            const GET_ALL_LEAGUE_POSITIONS_FOR_SUMMONER =
                'LEAGUE.GET_ALL_LEAGUE_POSITIONS_FOR_SUMMONER'
        }

        namespace LOL_STATUS {
            const GET_SHARD_DATA = 'LOL_STATUS.GET_SHARD_DATA'
        }

        namespace MATCH {
            const GET_MATCH = 'MATCH.GET_MATCH'
            const GET_MATCHLIST = 'MATCH.GET_MATCHLIST'
            const GET_RECENT_MATCHLIST = 'MATCH.GET_MATCHLIST'
            const GET_MATCH_TIMELINE = 'MATCH.GET_MATCH_TIMELINE'
        }

        namespace SPECTATOR {
            const GET_CURRENT_GAME_INFO_BY_SUMMONER =
                'SPECTATOR.GET_CURRENT_GAME_INFO_BY_SUMMONER'
            const GET_FEATURED_GAMES = 'SPECTATOR.GET_FEATURED_GAMES'
        }

        namespace SUMMONER {
            const GET_BY_ACCOUNT_ID = 'SUMMONER.GET_BY_ACCOUNT_ID'
            const GET_BY_SUMMONER_NAME = 'SUMMONER.GET_BY_SUMMONER_NAME'
            const GET_BY_SUMMONER_ID = 'SUMMONER.GET_BY_SUMMONER_ID'
        }
    }
}
