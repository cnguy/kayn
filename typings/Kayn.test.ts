/// <reference path='./index.d.ts' />
/// <reference path="./node_modules/@types/node/index.d.ts" />

import * as lolapi from 'kayn';

const REGIONS = lolapi.REGIONS;
const init = lolapi.Kayn;
const RedisCache = lolapi.RedisCache;
const METHOD_NAMES = lolapi.METHOD_NAMES;
const BasicJSCache = lolapi.BasicJSCache;

const kayn = init('123')({
    region: 'na'
});
kayn.Summoner.by.name("test").callback((p1, p2) => console.log("hey world"))
console.log("Hello")
kayn.Summoner.by.name("test")
.then(({ accountId }) => console.log(accountId))
kayn.League.by.uuid("1a3cc7ff-9b40-3927-b646-8d777e97148a")

const main = async () => {
    const summoner = await kayn.Summoner.by.name("Contractz");
}
