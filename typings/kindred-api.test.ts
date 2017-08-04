/// <reference path='index.d.ts' />
/// <reference path="./node_modules/@types/node/index.d.ts" />

import * as lolapi from 'kindred-api';
require('dotenv').config({ path: '../.env' })
// const REGIONS = lolapi.REGIONS;
const key: string = process.env.KEY ? process.env.KEY as string : 'dummy'

const k = new lolapi.Kindred({
    key,
    limits: [[500, 10], [3000, 600]] as any, // allows automatic retries
    retryOptions: {
        auto: true, // necessary to overwrite automatic retries
        numberOfRetriesBeforeBreak: 3
    },
    debug: true
    // limits: lolapi.LIMITS.PROD
});

function printSummoner(summoner: lolapi.Summoner): void {
    console.log(
        `
            name                : ${summoner.name}
            account id          : ${summoner.accountId}
            id                  : ${summoner.id}
            profile icon id     : ${summoner.profileIconId}
            last revision date  : ${summoner.revisionDate}
        `
    )
}

function printIdsFromChampionMasteries(championMasteries: Array<lolapi.ChampionMastery>): void {
    const championMasteriesIds = championMasteries.map(el => el.championId)
    const concatedIds = championMasteriesIds.reduce((acc, el) => `${acc} ${el}`, '')
    console.log(`champion masteries ids: ${concatedIds}`)
}

function printIdsFromChampions(data: lolapi.Champions): void {
    const championIds = data.champions.map(el => el.id)
    const concatedIds = championIds.reduce((acc, el) => `${acc} ${el}`, '')
    console.log(`champion ids: ${concatedIds}`)
}

function printChampionMastery(championMastery: lolapi.ChampionMastery): void { // purposefully printing less info here
    console.log(
        `
            playerId        : ${championMastery.playerId}
            championLevel   : ${championMastery.championLevel}
            championId      : ${championMastery.championId}

        `
    )
}

k.Summoner.get({ name: "Contractz" }, lolapi.print)
k.Summoner.get({ name: "Contractz" })
    .then(summoner => {
        let contractz = summoner
        printSummoner(contractz)
    })
    .catch(err => console.error(err))

k.Summoner.get({ id: 32932398 }, lolapi.print)
k.Summoner.get({ name: 'Contractz' })
 .then((data) => console.log(data))
 .catch((error) => console.error(error))

k.Summoner.by.name('Contractz', lolapi.print)

;(async () => {
    console.log('async print')
    try {
        const summoner = await k.Summoner.by.name('Contractz')
        printSummoner(summoner)
    } catch (ex) {
        console.error(ex)
    }
})()

;(async () => {
    try {
        printIdsFromChampionMasteries(await k.ChampionMastery.all({ name: 'Contractz' }))
    } catch (ex) {
        console.error(ex)
    }
})()

k.ChampionMastery.all({ name: 'Contractz' })
    .then(data => printIdsFromChampionMasteries(data))
    .catch(err => console.error(err))

// this is ugly since it's two required params, but I wanted to stay consistent when writing the .get functions
k.ChampionMastery.get({ playerId: 32932398, championId: 79 })
    .then(data => printChampionMastery(data))
    .catch(err => console.error(err))

k.Summoner.by.name('Contractz', 'na')

;(async () => {
    try {
        console.log(`Total score: ${await k.ChampionMastery.totalScore({ name: 'Contractz' })}`)
    } catch (ex) {
        console.error(ex)
    }
})()

;(async () => {
    try {
        const data = await k.Champion.all({}) // hax
        const region = 'kr'
        const options = { freeToPlay: true }
        const dataWithOpts = await k.Champion.all({ region, options })
        printIdsFromChampions(data)
        printIdsFromChampions(dataWithOpts)
    } catch (ex) {
        console.error(ex)
    }
})()

k.Champion.by.id(37, function (err, data) {
    if (err) {
        console.error('err:', err)
    } else {
        console.log(`Champion with id ${data.id} active?: ${data.active}`)
    }
})

;(async () => {
    try {
        const randomChampion = await k.Champion.by.id(37)
        console.log(randomChampion.id)
    } catch (ex) {
        console.error(ex)
    }
})()


;(async () => {
    try {
        const naShardData = await k.Status.get({ region: 'na' })
        const krShardData = await k.Status.get({ region: 'kr' })
        console.log('na:', naShardData)
        console.log('kr:', krShardData)
    } catch (ex) {
        console.log(ex)
    }
})()