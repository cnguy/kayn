/// <reference path='index.d.ts' />
/// <reference path="./node_modules/@types/node/index.d.ts" />

import * as lolapi from 'kindred-api';
require('dotenv').config({ path: '../.env' })
// const REGIONS = lolapi.REGIONS;
const key: string = process.env.KEY ? process.env.KEY as string : 'dummy'

const k = new lolapi.Kindred({
    key,
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
    .catch(err => console.log(err))

k.Summoner.get({ id: 32932398 }, lolapi.print)
k.Summoner.get({ name: 'Contractz' })
 .then((data) => console.log(data))
 .catch((error) => console.error(error))

k.Summoner.by.name('Contractz', lolapi.print)

;(async () => {
    console.log('async print')
    const summoner = await k.Summoner.by.name('Contractz')
    printSummoner(summoner)
})()

;(async () => {
    printIdsFromChampionMasteries(await k.ChampionMastery.all({ name: 'Contractz' }))
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
    console.log(`Total score: ${await k.ChampionMastery.totalScore({ name: 'Contractz' })}`)
})()

;(async () => {
    const data = await k.Champion.all({}) // hax
    const region = 'kr'
    const options = { freeToPlay: true }
    const dataWithOpts = await k.Champion.all({ region, options })
    printIdsFromChampions(data)
    printIdsFromChampions(dataWithOpts)
})()

k.Champion.by.id(37, function (err, data) {
    console.log(data) // we lose type data in callbacks atm
})

;(async () => {
    const randomChampion2 = await k.Champion.by.id(37)
    console.log(randomChampion2.botEnabled)
})()
