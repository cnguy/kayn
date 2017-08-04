declare module 'kindred-api' {
    class Kindred {
        constructor({
            key,
            region,
            limits
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
    interface REGIONS {
        BRAZIL: Region;
        EUROPE: Region;
        EUROPE_WEST: Region;
        KOREA: Region;
        LATIN_AMERICAN_NORTH: Region;
        LATIN_AMERICA_SOUTH: Region;
        NORTH_AMERICA: Region;
        OCEANIA: Region;
        RUSSIA: Region;
        TURKEY: Region;
        JAPAN: Region;
    }

    declare interface KindredConstructor {
        key: string,
        region?: Region,
        limits?: Limits
    };

    type Region = 'br' | 'eune' | 'euw' | 'kr' | 'lan' | 'las' | 'na' | 'oce' | 'ru' | 'tr' | 'jp';

    type Limits = (number[])[]; // bad type

    type Callback<T> = (err: any, data: T) => void;

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
}