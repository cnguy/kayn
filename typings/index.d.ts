declare module 'kindred-api' {
    class Kindred {
        constructor({
            key,
            region,
            limits,
        }: KindredConstructor)

        Summoner: {
            get: ({
                name,
            }: {
                name?: string,
            }, cb: Callback) => void,
        }
    }
}

type KindredConstructor = {
    key: string,
    region?: Region,
    limits?: Limits,
}

type Region = 'br' | 'eune' | 'euw' | 'kr' | 'lan' | 'las' | 'na' | 'oce' | 'ru' | 'tr' | 'jp'

type Limits = Array<Array<number>> // bad type

type Callback = (err: any, data: any) => void