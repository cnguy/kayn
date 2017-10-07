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
    // These two limits will be the default limit
    const appLimits = [
        {
            count: 20,
            per: 1,
        },
        {
            count: 100,
            per: 120,
        }
    ]

    const config = {
        debug: true
        // and a lot of other configuration stuffs
        // that was previously available in kindred-api
    }
    
    // Key is by default process.env.RIOT_LOL_API_KEY
    // appLimits are mandatory
    // withConfig is optional
    // Remember: this is subject to change! I'm still "designing"
    const api = require('unnamed-for-now')(/* optional key */)(apiLimits).withConfig(config)

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
        api.Summoner.by.name('pYang').end(print)
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

0.0.2 will probably be endpoints/rate limiter/promise&callbacks.

Extras
* TypeScript
* Parameter / query checks (I love query checks, but I'm delaying this) for typeless JS
* A lot of useful helpers for common patterns as they arise
