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
            }, cb?: Callback) => Promise<ChampionMastery>

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
            }, cb?: Callback) => Promise<Array<ChampionMastery>>

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
            }, cb?: Callback) => Promise<number>
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
            }, cb?: Callback) => Promise<Champions>;

            by: {
                id: (id: number, regionOrCallback?: Region | Callback, cb?: Callback) => Promise<Champion>
            }
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
            }, cb?: Callback) => Promise<Summoner>,

            by: {
                id: (id: number, regionOrCallback?: Region | Callback, cb?: Callback) => Promise<Summoner>,
                name: (name: string, regionOrCallback?: Region | Callback, cb?: Callback) => Promise<Summoner>,
                account: (accountId: number, regionOrCallback?: Region | Callback, cb?: Callback) => Promise<Summoner>
            }
        };
    }

    declare function print: Callback;
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

    type Callback = (err: any, data: any) => void;

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
}