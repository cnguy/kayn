An elegant way of querying the League of Legend's API.

# Why

So I decided to come back to rewrite this whole library (unfortunately) since the code really bothered me, and I have a lot of time now (I quit work).

# Goals:

## Different name (kindred-api is an awful name)

Different name, back to 0.0.2 (0.0.1 is for name). The 2.X.X always bothered me anyways.

## Elegant API

I'm probably going to use chainable methods. To add a region or query parameters to a call, I envision that you will be able to chain a region() or query() call. Default region will be used if there is no appended region call of course.

This is subject to change, but the end result should look something like this.

```javascript
async function main() {
    const config = {
        debug: true
        // and a lot of other configuration stuffs
        // that was previously available in kindred-api
    }
    
    // Key is by default process.env.RIOT_LOL_API_KEY
    // appLimits are mandatory
    // withConfig is optional
    // Remember: this is subject to change! I'm still "designing"
    const api = require('unnamed-for-now')(/* optional key */).withConfig(config)

    try {
        const summoner = await api.Summoner.by.name('Contractz').region('na')
        const matchlist = await api.Matchlist
            .by.accountID(summoner.accountId)
            .query({ queue: QUEUES.RANKED_SOLO_5x5 })
            .query({ champion: [81, 429] })
            .query({ season: 8 })
            // The query calls can be batched into
            // one single query call as well
            // .query({ key: value, key: value, key: value })
            .region('na')
        console.log(matchlist)

        // API methods return promises
        // To use callbacks, call the end() method
        const print = (err, data) => console.log(err, data)
        api.Summoner.by.name('pYang').callback(print)
    } catch (error) {
        console.error(error)
    }
}
```

## Better code

Code was really bad, and there were tons of things that were in places that they did not need to be.

To check it out yourself (it's obvious what is bad), go download the final version.

```yarn add kindred-api``` (v2.0.83)

## Stay fun to use

It should have some of the features that made `kindred-api` fun, such as
* customizability
* the simple debugging for examining your requests

I imagine the new API will make it more easy and fun to use as well.

# Estimated Time of Completion: 1-2 months

Core features first
* All basic endpoints (no tournament, DDragon for now)
* Decent rate limiter that follows Riot Games LoL API rules (I might use Colorfulstan's rate limiter to save time early, if his is good, I might just straight up use it. seems nice!)
* Useful config
* Cache support
* Core tests

0.0.1 is for reserving name

0.0.2 (the real 0.0.1 lol) will probably be endpoints/rate limiter (need to write request/retry as well)/promise&callbacks.

0.1.0 will be all the `kindred-api` config plus debugging prints

0.2.0 will be TypeScript support

0.3.0 will be parameter/query parameter checks

Extras
* TypeScript
* Parameter / query checks (I love query checks, but I'm delaying this) for typeless JS
* A lot of useful helpers for common patterns as they arise

# Current API

`kayn` methods do not take `region`, `query`, or `callback` arguments like in `kindred-api` and other libraries. As of now, the maximum amount of arguments a `kayn` method can take is around 2 -- Most stop at 1. You'll see why later below.

`kayn`'s api is reliant on regions instead of platform ids. Regions are transformed to platform ids within the code wherever necessary.

## Request Naming Conventions 

`get`: to target and grab something specific, where the parameters are also easy to guess (Match.get would be grabbing a match via its match id). However, runes/matchlist take different arguments (summoner id vs account id), and so they use the `by.xxx` naming below.

`list`: to list out something (e.g. a list of champions, a list of challengers, etc).

`by.xxx`: `by.name`, `by.accountID`, `by.id` (summonerID) is everywhere necessary (e.g. Matchlist.by.accountID, Summoner.by.name, Summoner.by.id). I have not added extra methods like Matchlist.by.name yet. This naming makes the request parameter guessable.

## Setting the Region of a Request

Append `.region(regionAbbr)` to a call to set the region.

```javascript
kayn.Summoner.by.name('Faker').region('kr')
```

## Adding Query Parameters to a Request

Append `.query(key->value)` to a call to add a query. A query is just a regular JavaScript object. Therefore, you can either chain multiple query parameters at once, or pass in a whole blob.

```javascript
const config = {
    season: 7,
    champion: 67,
    queue: 420,
}

kayn.Matchlist.by.accountID(accountID).query(config)

kayn.Match.by.accountID(accountID)
    .query({ season: 7 })
    .query({ champion: 67 })
    .query({ queue: 420 })
```

## Promises

All `kayn` methods support promises. 

```javascript
const promise = kayn.Summoner.by.name('Contractz')
promise
    .then(data => console.log(data))
    .catch(err => console.error(err))
```

### Await

Naturally, you can `await` any method as long as you have not called `.callback`.

```javascript
const main = async () => {
    try {
        const summoner = await kayn.Summoner.by.name('Contractz')
    } catch (ex) {
        console.error(ex)
    }
}
```

## Callbacks

This is simply a renaming of `superagent`'s `end` method. As stated before, `kayn` methods do not have callback parameters.

However, passing in callbacks is still trivial. This is similar to how `region` and `query` are set as well (thanks `superagent`).

```javascript
const printBoth = (err, data) => console.log(err, data)
kayn.Summoner.by.name('Contractz').callback(printBoth)
```

## High-level Overview of API

This is all (both endpoints & methods) in the same order as in the official docs.

Note that the API is not fully consistent. I wanted the API to be readable & easy-to-use-without-documentation, but still be somewhat terse, and so exceptions had to be made for now.

```javascript
/* CHAMPION-MASTERY-V3 */
ChampionMastery.list(summonerID: int)
ChampionMastery.get(summonerID: int)(championID: int)
ChampionMastery.total(summonerID: int)

/* CHAMPION-V3 */
Champion.list()
Champion.get(championID: int)

/* LEAGUE-V3 */
Challenger.list(queueName: string)
Leagues.by.id(summonerID: int)
Master.list(queueName: string)
LeaguePositions.by.id(summonerID: int)

/* LOL-STATIC-DATA-V3 */

/* LOL-STATUS-V3 */
Status.get()

/* MASTERIES-V3 */
Masteries.by.id(summonerID: int)

/* MATCH-V3 */
Match.get(matchID: int)
Matchlist.by.accountID(accountID: int)
Match.timeline(matchID: int)

/* RUNES-V3 */
Runes.by.id(summonerID: int)

/* SPECTATOR-V3 */
CurrentGame.by.id(summonerID: int)
FeaturedGames.list()

/* SUMMONER-V3 */
Summoner.by.name(summonerName: string)
Summoner.by.id(summonerID: int)
Summoner.by.accountID(accountID: int)
```