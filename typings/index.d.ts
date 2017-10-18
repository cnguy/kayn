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
    constructor(config: any, serviceName: serviceName, endpoint: endpoint, methodName: methodName, httpMethodType: httpMethodType);
    region(region: region): KaynRequest<T>;
    query(query: Object): KaynRequest<T>;
    then(resolve: (data: T) => void, reject?: any): any;
    catch(callback: callback<T>): any;
    callback(callback: callback<T>): void;
}

type callback<T> = (err: any, data: T) => void;

// a lot of these are temp and will be improved in later releases.
type serviceName = string;
type methodName = string;
type endpoint = string;
type KaynConfig = any;
type httpMethodType = string;
  
type region = string;
type queueName = string;

declare module 'kayn' {
    export function Kayn(key: string): (config: KaynConfig) => Kayn;
}
