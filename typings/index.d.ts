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

        public Challenger: {
            list: (queue: QueueString, regionOrCallback?: Region | Callback<ChallengerLeague>, cb?: Callback<ChallengerLeague>) => Promise<ChallengerLeague>;
        }

        public Master: {
            list: (queue: QueueString, regionOrCallback?: Region | Callback<MasterLeague>, cb?: Callback<MasterLeague>) => Promise<MasterLeague>;
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

        public Match: {
            by: {
                id: (id: number, optionsOrRegionOrCallback?: OptsOrRegOrCb<Match>, regionOrCallback?: RegOrCb<Match>, cb?: Callback<Match>) => Promise<Match>
            }
        }

        public Matchlist: {
            by: {
                id: (id: number, optionsOrRegionOrCallback?: OptsOrRegOrCb<Matchlist>, regionOrCallback?: RegOrCb<Matchlist>, cb?: Callback<Matchlist>) => Promise<Matchlist>;
                name: (name: string, optionsOrRegionOrCallback?: OptsOrRegOrCb<Matchlist>, regionOrCallback?: RegOrCb<Matchlist>, cb?: Callback<Matchlist>) => Promise<Matchlist>;
                account: (account: number, optionsOrRegionOrCallback?: OptsOrRegOrCb<Matchlist>, regionOrCallback?: RegOrCb<Matchlist>, cb?: Callback<Matchlist>) => Promise<Matchlist>;
            };

            recent: ({
                id,
                name,
                accountId,
                region
            }: {
                id?: number,
                name?: string,
                accountId?: number,
                region?: Region
            }, cb?: Callback<Matchlist>) => Promise<Matchlist>
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
    type PlatformId = "BR1" | "EUN1" | "EUW1" | "JP1" | "KR" | "LA1" | "LA2" | "NA1" | "NA" | "OC1" | "TR1" | "RU" | "PBE1"

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

    class Match {
        public gameId: number;
        public platformId: PlatformId;
        public gameCreation: number;
        public gameDuration: number;
        public queueId: number; // TODO: improve
        public mapId: number; // TODO: improve
        public seasonId: number; // TODO: improve
        public gameVersion: string;
        public gameMode: string; // TODO: improve
        public gameType: string; // TODO: improve
        public teams: Array<Team>;
        public participants: Array<Participant>;
        public participantIdentities: Array<ParticipantIdentity>;
    }

    class Team {
        public teamId: number;
        public win: boolean;
        public firstBlood: boolean;
        public firstTower: boolean;
        public firstInhibitor: boolean;
        public firstBaron: boolean;
        public firstDragon: boolean;
        public firstRiftHerald: boolean;
        public towerKills: number;
        public inhibitorKills: number;
        public baronKills: number;
        public dragonKills: number;
        public vilemawKills: number;
        public riftHeraldKills: number;
        public dominionVictoryScore: number;
        public bans: Array<{
            championId: number;
            pickTurn: number;
        }>;
    }

    class Participant {
        public participantId: number;
        public teamId: number;
        public championId: number;
        public spell1Id: number;
        public spell2Id: number;
        public masteries: Array<{
            masteryId: number;
            rank: number;
        }>;
        public runes: Array<{
            runeId: number;
            rank: number;
        }>;
        public highestAchievedSeasonTier: string;
        public stats: {
            participantId: number;
            win: boolean;
            item0: number;
            item1: number;
            item2: number;
            item3: number;
            item4: number;
            item5: number;
            item6: number;
            kills: number;
            deaths: number;
            assists: number;
            largestKillingSpree: number;
            largestMultiKill: number;
            killingSprees: number;
            longestTimeSpentLiving: number;
            doubleKills: number;
            tripleKills: number;
            quadraKills: number;
            pentaKills: number;
            unrealKills: number;
            totalDamageDealt: number;
            magicDamageDealt: number;
            physicalDamageDealt: number;
            trueDamageDealt: number;
            largestCriticalStrike: number;
            totalDamageDealtToChampions: number;
            magicDamageDealtToChampions: number;
            physicalDamageDealtToChampions: number;
            trueDamageDealtToChampions: number;
            totalHeal: number;
            totalUnitsHealed: number;
            damageSelfMitigated: number;
            damageDealtToObjectives: number;
            damageDealtToTurrets: number;
            visionScore: number;
            timeCCingOthers: number;
            totalDamageTkaen: number;
            magicalDamageTaken: number;
            physicalDamageTaken: number;
            trueDamageTaken: number;
            goldEarned: number;
            goldSpent: number;
            turretKills: number;
            inhibitorKills: number;
            totalMinionsKilled: number;
            neutralMinionsKilled: number;
            neutralMinionsKilledTeamJungle: number;
            neutralMinionsKilledEnemyJungle: number;
            totalTimeCrowdControlDealt: number;
            champLevel: number;
            visionWardsBoughtInGame: number;
            sightWardsBoughtInGame: number;
            wardsPlaced: number;
            wardsKilled: number;
            firstBloodKill: boolean;
            firstBloodAssist: boolean;
            firstTowerKill: boolean;
            firstTowerAssist: boolean;
            combatPlayerScore: number;
            objectivePlayerScore: number;
            totalPlayerScore: number;
            totalScoreRank: number;
        };
        timeline: {
            participantId: number;
            creepsPerMinDeltas: Deltas;
            xpPerMinDeltas: Deltas;
            goldPerMinDeltas: Deltas;
            csDiffPerMinDeltas: Deltas;
            xpDiffPerMinDeltas: Deltas;
            damageTakenPerMinDeltas: Deltas;
            damageTakenDiffPerMinDeltas: Deltas;
            role: string; // TODO: improve
            lane: string; // TODO: improve
        }
    }

    interface Deltas {
        "10-20": number;
        "0-10": number;
    }

    class ParticipantIdentity {
        public participantId: number;
        public player: {
            platformId: PlatformId;
            accountId: number;
            summonerName: string;
            summonerId: number;
            currentPlatformId: string;
            currentAccountId: number;
            matchHistoryUri: string;
            profileIcon: number;
        }
    }

    class Matchlist {
        public matches: Array<{
            lane: string; // TODO: improve
            gameId: number; // TODO: improve
            champion: number; // TODO: improve
            platformid: PlatformId;
            timestamp: number;
            queue: number; // TODO: improve
            role: string; // TODO: improve
            season: number; // TODO: improve
        }>
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

    type OptsOrRegOrCb<T> = Object | Region | Callback<T>; // TODO: improve so that options have types for each endpoint
    type RegOrCb<T> = Region | Callback<T>
}