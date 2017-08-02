/// <reference path='index.d.ts' />
/// <reference path="./node_modules/@types/node/index.d.ts" />

import * as lolapi from 'kindred-api';
require('dotenv').config({ path: '../.env' })

const key: string = process.env.KEY ? process.env.KEY as string : 'dummy'

const k = new lolapi.Kindred({
    key,
    // limits: lolapi.LIMITS.PROD
});

k.Summoner.get({ name: "Contractz" }, lolapi.print)

k.Summoner.get({ id: 32932398 }, lolapi.print)
k.Summoner.get({ name: 'Contractz' })
 .then((data: any) => console.log(data))
 .catch((error: any) => console.error(error))

k.Summoner.by.name('Contractz', lolapi.print)
k.Summoner.by.name('Contractz')
 .then((data: any) => console.log(data))
 .catch((error: any) => console.error(error))
try {
    async () => {
        const summoner = await k.Summoner.by.name('Contractz')
    }
} catch (ex) {
    console.error(ex);
}
