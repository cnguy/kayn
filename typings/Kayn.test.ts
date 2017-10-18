/// <reference path='./index.d.ts' />
/// <reference path="./node_modules/@types/node/index.d.ts" />

import * as lolapi from 'kayn';

const REGIONS = lolapi.REGIONS;
const init = lolapi.Kayn;
const RedisCache = lolapi.RedisCache;
const METHOD_NAMES = lolapi.METHOD_NAMES;
const BasicJSCache = lolapi.BasicJSCache;

const kayn = init('123')({});
kayn.Summoner.by.name("test").callback((p1, p2) => console.log("hey world"))
console.log("Hello")
kayn.Summoner.by.name("test")
.then(data => data.accountId)

const main = async () => {
    const summoner = await kayn.Summoner.by.name("Contractz");
}