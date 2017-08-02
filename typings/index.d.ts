declare module 'kindred-api' {
    class Kindred {
        constructor({
            key,
            region,
            limits
        }: KindredConstructor)

        public Summoner: {
            get: ({
                name,
                id,
                accountId
            }: {
                id?: number,
                name?: string,
                accountId?: number
            }, cb?: Callback): Promise<any>,

            by: {
                id: (id: number, cb?: Callback): Promise<any>,
                name: (name: string, cb?: Callback): Promise<any>,
                account: (accountId: number, cb?: Callback): Promise<any>
            }
        };
    }

    declare function print: Callback;
}

type KindredConstructor = {
    key: string,
    region?: Region,
    limits?: Limits
};

type Region = 'br' | 'eune' | 'euw' | 'kr' | 'lan' | 'las' | 'na' | 'oce' | 'ru' | 'tr' | 'jp';

type Limits = (number[])[]; // bad type

type Callback = (err: any, data: any) => void;