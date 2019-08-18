/// <reference path='./index.d.ts' />
/// <reference path="./node_modules/@types/node/index.d.ts" />

import * as lolapi from 'kayn'

const REGIONS = lolapi.REGIONS
const init = lolapi.Kayn
const RedisCache = lolapi.RedisCache
const METHOD_NAMES = lolapi.METHOD_NAMES
const BasicJSCache = lolapi.BasicJSCache
const LRUCache = lolapi.LRUCache

const kayn = init('123')({
    region: 'na',
})
kayn.Summoner.by.name('test').callback((p1, p2) => console.log('hey world'))
console.log('Hello')
kayn.Summoner.by.name('test').then(({ accountId }) => console.log(accountId))
kayn.League.by.uuid('1a3cc7ff-9b40-3927-b646-8d777e97148a')

new LRUCache({
    max: 2,
    dispose: (key, value) => {},
})

const main = async () => {
    const summoner = await kayn.Summoner.by.name('Contractz')

    kayn.Summoner.by
        .name('Contractz')
        .then(console.log)
        .catch(({ statusCode }) => console.log(statusCode))
    try {
        await kayn.Summoner.by.name('Contractz')
    } catch (error) {
        const kaynError: lolapi.KaynError = error
        console.log(kaynError.statusCode)
    }

    kayn.Summoner.by.name('whatever').callback(function(error, data) {
        console.log(data)
        console.log(error.statusCode)
    })

    const test = await kayn.DDragon.Champion.get('test').locale('en_US')
    const leagueEntries = await kayn.League.Entries.bySummonerID('test')
    if (leagueEntries[0].veteran) {
        console.log('do something')
    }

    const leagueEntries2 = await kayn.League.Entries.list('RANKED_SOLO_5x5', 'DIAMOND', 'I')

    const ddragonChampion = await kayn.DDragon.Champion.get('test')
}

kayn.flushCache(function(err, data) {})
