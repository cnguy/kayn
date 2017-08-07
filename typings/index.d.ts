declare module 'kindred-api' {
    class Kindred {
        constructor({
            key,
            region,
            limits,
            debug,
            showKey,
            showHeaders,
            retryOptions
        }: KindredConstructor);

        public ChampionMastery: {
            get: ({
                playerId,
                championId,
                region
            }: {
                playerId: number,
                championId: number,
                region?: Region
            }, cb?: Callback<ChampionMastery>) => Promise<ChampionMastery>

            all: ({
                id,
                name,
                accountId,
                region
            }: {
                id?: number,
                name?: string,
                accountId?: number,
                region?: Region
            }, cb?: Callback<Array<ChampionMastery>>) => Promise<Array<ChampionMastery>>

            totalScore: ({
                id,
                name,
                accountId,
                region
            }: {
                id?: number,
                name?: string,
                accountId?: number,
                region?: Region
            }, cb?: Callback<number>) => Promise<number>
        }

        public Champion: {
            all: ({
                region,
                options
            }: {
                region?: Region,
                options?: {
                    freeToPlay?: boolean
                }
            }, cb?: Callback<Champions>) => Promise<Champions>;

            by: {
                id: (id: number, regionOrCallback?: Region | Callback<Champion>, cb?: Callback<Champion>) => Promise<Champion>
            }
        }

        public League: {
            get: ({
                id,
                name,
                accountId,
                region
            }: {
                id?: number,
                name?: string,
                accountId?: number,
                region?: Region
            }, cb?: Callback<Array<AnyLeague>>) => Promise<Array<AnyLeague>>;

            positions: ({
                id,
                name,
                accountId,
                region
            }: {
                id?: number,
                name?: string,
                accountId?: number,
                region?: Region
            }, cb?: Callback<Array<LeaguePosition>>) => Promise<Array<LeaguePosition>>;

            Challenger: {
                list: (queue: QueueString, regionOrCallback?: Region | Callback<ChallengerLeague>, cb?: Callback<ChallengerLeague>) => Promise<ChallengerLeague>;
            }

            Master: {
                list: (queue: QueueString, regionOrCallback?: Region | Callback<MasterLeague>, cb?: Callback<MasterLeague>) => Promise<MasterLeague>;
            }

            challengers: ({
                queue,
                region
            }: {
                queue: QueueString,
                region?: Region
            }, cb?: Callback<ChallengerLeague>) => Promise<ChallengerLeague>;

            masters: ({
                queue,
                region
            }: {
                queue: QueueString,
                region?: Region
            }, cb?: Callback<MasterLeague>) => Promise<MasterLeague>;
        }

        public Runes: {
            get: ({
                id,
                name,
                accountId,
                region
            }: {
                id?: number,
                name?: string,
                accountId?: number,
                region?: Region
            }, cb?: Callback<RunesResp>) => Promise<RunesResp>;

            by: {
                id: (id: number, regionOrCallback?: Region | Callback<RunesResp>, cb?: Callback<RunesResp>) => Promise<RunesResp>;
                name: (name: string, regionOrCallback?: Region | Callback<RunesResp>, cb?: Callback<RunesResp>) => Promise<RunesResp>;
                accountId: (accountId: number, regionOrCallback?: Region | Callback<RunesResp>, cb?: Callback<RunesResp>) => Promise<RunesResp>;
            }
        }
        
        public Masteries: {
            get: ({
                id,
                name,
                accountId,
                region
            }: {
                id?: number,
                name?: string,
                accountId?: number,
                region?: Region
            }, cb?: Callback<MasteriesResp>) => Promise<MasteriesResp>;

            by: {
                id: (id: number, regionOrCallback?: Region | Callback<MasteriesResp>, cb?: Callback<MasteriesResp>) => Promise<MasteriesResp>;
                name: (name: string, regionOrCallback?: Region | Callback<MasteriesResp>, cb?: Callback<MasteriesResp>) => Promise<MasteriesResp>;
                accountId: (accountId: number, regionOrCallback?: Region | Callback<MasteriesResp>, cb?: Callback<MasteriesResp>) => Promise<MasteriesResp>;
            }
        }

        public Status: {
            get: ({
                region
            }: { region?: Region }, cb?: Callback<ShardData>) => Promise<ShardData>;
        }

        public Summoner: {
            get: ({
                id,
                name,
                accountId,
                region
            }: {
                id?: number,
                name?: string,
                accountId?: number,
                region?: Region
            }, cb?: Callback<Summoner>) => Promise<Summoner>,

            by: {
                id: (id: number, regionOrCallback?: Region | Callback<Summoner>, cb?: Callback<Summoner>) => Promise<Summoner>,
                name: (name: string, regionOrCallback?: Region | Callback<Summoner>, cb?: Callback<Summoner>) => Promise<Summoner>,
                account: (accountId: number, regionOrCallback?: Region | Callback<Summoner>, cb?: Callback<Summoner>) => Promise<Summoner>
            }
        };
    }

    declare function print: Callback<any>;
    declare enum REGIONS {
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
        JAPAN = 'jp'
    }
    declare enum QUEUE_STRINGS {
        RANKED_SOLO_5x5 = 'RANKED_SOLO_5x5',
        RANKED_FLEX_SR = 'RANKED_FLEX_SR',
        RANKED_FLEX_TT = 'RANKED_FLEX_TT'
    }

    declare interface KindredConstructor {
        key: string,
        region?: Region,
        limits?: Limits,
        debug?: boolean,
        showKey?: boolean,
        showHeaders?: boolean,
        retryOptions?: {
            auto: boolean,
            numberOfRetriesBeforeBreak: number
        }
    };

    type Region = 'br' | 'eune' | 'euw' | 'kr' | 'lan' | 'las' | 'na' | 'oce' | 'ru' | 'tr' | 'jp';

    type Limits = (number[])[]; // bad type
    type StatusCode = number
    type KindredRequestError  = StatusCode | Error
    type Callback<T> = (err: KindredRequestError, data: T) => void;

    class Summoner {
        public accountId: number;
        public id: number;
        public name: string;
        public summonerLevel: number;
        public profileIconId: number;
        public revisionDate: Date;
    }

    class ChampionMastery {
        public championLevel: number;
        public chestGranted: boolean;
        public championPoints: number;
        public championPointsSinceLastLevel: number;
        public playerId: number;
        public championPointsUntilNextLevel: number;
        public tokensEarned: number;
        public championId: number;
        public lastPlayTime: number;
    }

    class Champions { // Riot nested this in "champions"
        public champions: Array<Champion>;
    }

    class Champion {
        public rankedPlayEnabled: boolean;
        public botEnabled: boolean;
        public botMmEnabled: boolean;
        public active: boolean;
        public freeToPlay: boolean;
        public id: number;
    }

    type QueueString = 'RANKED_SOLO_5x5' | 'RANKED_FLEX_SR' | 'RANKED_FLEX_TT'

    class ChallengerLeague {
        public name: string;
        public tier: "CHALLENGER";
        public queue: QueueString;
        public entries: Array<ChallengerLeagueEntry>;
    }

    class MasterLeague {
        public name: string;
        public tier: "MASTER";
        public queue: QueueString;
        public entries: Array<MasterLeagueEntry>;
    }

    type Tier = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND" | "MASTER" | "CHALLENGER";
    type Rank = "V" | "IV" | "III" | "II" | "I";

    interface AnyLeague {
        public name: string;
        public tier: Tier;
        public queue: QueueString;
        public entries: Array<AnyLeagueEntry>;
    }

    interface ChallengerLeagueEntry {
        playerOrTeamId: number;
        playerOrTeamName: string;
        leaguePoints: number;
        rank: "I";
        wins: number;
        losses: number;
        veteran: boolean;
        inactive: boolean;
        freshBlood: boolean;
        hotStreak: boolean;
    }

    interface MasterLeagueEntry {
        playerOrTeamId: number;
        playerOrTeamName: string;
        leaguePoints: number;
        rank: "I";
        wins: number;
        losses: number;
        veteran: boolean;
        inactive: boolean;
        freshBlood: boolean;
        hotStreak: boolean;
        miniSeries?: {
            target: number,
            wins: number,
            losses: number,
            progress: string
        }
    }

    interface AnyLeagueEntry {
        playerOrTeamId: number;
        playerOrTeamName: string;
        leaguePoints: number;
        rank: Rank;
        wins: number;
        losses: number;
        veteran: boolean;
        inactive: boolean;
        freshBlood: boolean;
        hotStreak: boolean;
        miniSeries?: {
            target: number,
            wins: number,
            losses: number,
            progress: string
        };
    }

    interface LeaguePosition {
        queueType: QueueString,
        hotStreak: boolean,
        wins: number,
        veteran: boolean,
        losses: number,
        playerOrTeamId: number,
        tier: Tier,
        playerOrTeamName: string,
        inactive: boolean,
        rank: Rank,
        freshBlood: boolean,
        leagueName: string,
        leaguePoints: number
    }
    
    class ShardData {
        public name: string;
        public region_tag: string;
        public hostname: string;
        public services: Array<Service>;
        public slug: string; // TODO: improve
        public locales: Array<string>; // TODO: improve
    }

    class Service {
        public status: string;
        public incidents: Array<any>; // TODO: improve
        public name: string;
        public slug: string;
    }

    class RunesResp {
        public summonerId: number;
        public pages: Array<RunePage>;
    }

    class RunePage {
        public current: boolean;
        public slots: Array<Rune>
    }

    interface Rune {
        runeSlotId: number,
        runeId: number
    }

     class MasteriesResp {
        public summonerId: number;
        public pages: Array<MasteryPage>;
    }

    class MasteryPage {
        public current: boolean;
        public masteries: Array<Mastery>
    }

    interface Mastery {
        id: number,
        rank: 0 | 1 | 2 | 3 | 4 | 5
    }
}