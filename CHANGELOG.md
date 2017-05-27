From here onwards I'll try to adhere to [Semantic Versioning](http://semver.org). I kinda messed up early, and so it ended up as 2.0 (lol). Sorry guys!

Treat my versioning as if it is 0.x.y.

**Upgrading versions should NEVER break your project, so update to the latest every now and then. :P**

[TODO](https://github.com/ChauTNguyen/kindred-api/blob/master/TODO.md) to view future changes.

## [2.0.53]() - getProfileIcons()/Static.profileIcons now works on empty.

## [2.0.52](https://github.com/ChauTNguyen/kindred-api/commit/1f6bd3ea9de0ef082e9e0db9e4a9cb76be6aaa4e) - Removed Status.get() and Match.get() standard functions.
I decided that this wasn't a good idea due to many reasons (gotta do a lot of parameter handling which is annoying).

2.0.48's Match change is reverted basically.

## [2.0.51](https://github.com/ChauTNguyen/kindred-api/commit/a30e3644cdcb6c3cf3158b70a418ff18760d4e8e) - More tinkering with buffers to increase Rate Limiter efficiency!
## [2.0.50](https://github.com/ChauTNguyen/kindred-api/commit/655ba1497352c83edd62c5178725e146d6925fd2) - Champion.list() bug is now fixed.
## [2.0.49](https://github.com/ChauTNguyen/kindred-api/commit/bf1ea95828ccfcd615e71671de6f8726ea85ad8a) - Rate limit logs now prints out `x-rate-limit-type` header as well.
## [2.0.48](https://github.com/ChauTNguyen/kindred-api/commit/f721f0790889ca4f4714066525cf1b4819b10b4b) - Matchlist is now cachable.

When I updated my methods to use the v3 endpoints, I forgot to update and include Matchlist methods for Matchlist requests and so the CACHE_TIMER for MATCHLIST would not be used.

Match and matchlist requests use the same endpoints now, but they should be cached for different times as matches are nonchanging while matchlists are updating every 30 minutes to an hour or so.

Also, the cache timer for Matchlist is now fixed (I had ONE_HOUR instead of HOUR).

**Match.get now is overloaded, and works with just an integer being passed in as well.**

So you can now do stuffs like this:

```javascript
k.Match
 .get(2501758619)
 .then(data => console.log(data))
 .catch(error => console.error(error))
```

## [2.0.46](https://github.com/ChauTNguyen/kindred-api/commit/4e7bb5e7510761ca9e00f5963b16b299d14ff415) - API errors are now returned as status codes instead of strings.

When catching errors, users now just get the raw status code instead of some colorized string.

This was mostly a patch to do a lot of code refactoring. :P

## [2.0.45](https://github.com/ChauTNguyen/kindred-api/commit/25dba4e5870e2e8df808c9dd761b2b0939e3b074) - Fixed a few bugs and things that could cause bugs in rare situations.
## [2.0.44](https://github.com/ChauTNguyen/kindred-api/commit/3fd4ac7ac04aa3a992098b22e987807f170efcc6) - Promises no longer retry on 404's.
## [2.0.43](https://github.com/ChauTNguyen/kindred-api/commit/e58830b1b64fa967d45c2a0bbc62118b82da69af) - Production rate limits are now correct.
## [2.0.42](https://github.com/ChauTNguyen/kindred-api/commit/a65adc4bd609b0f7860a5ee55a2fb701c1e73f8f) - (non-bugfix) Added MatchTimelineById function.
## [2.0.41](https://github.com/ChauTNguyen/kindred-api/commit/37f5a50b691d66886a4fff29f3ad21fbf2a8aa45) - (non-bugfix) Added Status endpoint tests.
## [2.0.40](https://github.com/ChauTNguyen/kindred-api/commit/6c22b55a19306f501200325618ff02dda5d25ea9) - Fixed _statusRequest (now passes in region).
## [2.0.39](https://github.com/ChauTNguyen/kindred-api/commit/8089717995d42ae2b222b18c57f79c0fb8e11a27) - Added [spread rate limiting](https://github.com/ChauTNguyen/kindred-api/wiki/Rate-Limiter).

* ^
* Added QUEUE_STRINGS constant for Challenger/Master endpoints.
* Fixed Challenger/Master parameters. ```.list()``` should be callable with region + callback now.

## [2.0.38](https://github.com/ChauTNguyen/kindred-api/commit/d2f63a58a73e5b8c2c8d811f7ca40da9394afdc1) - Simplified [.env](https://github.com/ChauTNguyen/kindred-api/wiki/Tests) setup.
## [2.0.37](https://github.com/ChauTNguyen/kindred-api/commit/f624869c9549a3ec59b468ceba3cb83555d82124) - Set of core, core-utils, in-memory-cache, summoner, runes, masteries tests complete.

## [2.0.36](https://github.com/ChauTNguyen/kindred-api/commit/f5a530bdeaa7d4329e033f1ff36bcbbbdd2f3d79) - Constructor needs API key.

Added basic check for initialization. Constructors must be called with a key parameter.

## [2.0.35](https://github.com/ChauTNguyen/kindred-api/commit/f49fe96e6b54bcdea4f14c73f4ff24720ca00553) - setRegion doesn't break your program! Tests introduced.
* Fixed setRegion. It had a guaranteed exit function previously (brainfart).

* Converted process.exit(1)'s into throws for testing purposes.

* Added basic tests! Will be adding more as I have more time.

## [2.0.34](https://github.com/ChauTNguyen/kindred-api/commit/1eeb044b5c90e454a9924b8c22dfe4d0826bd192) - Multi-valued params in urls now work again!

v3 API endpoints are back to accepting param=x&param=y style strings, and so I reverted how baseRequest works.

v3 urls are now in the following form:

```
https://na1.api.riotgames.com/lol/match/v3/matchlists/by-account/47776491?queue=420&queue=440&champion=81&api_key=<api_key>
```

instead of:

```
https://na1.api.riotgames.com/lol/match/v3/matchlists/by-account/47776491?queue=420,440&champion=81&api_key=<api_key>
```

## [2.0.33](https://github.com/ChauTNguyen/kindred-api/commit/344cb5c918f5a771b5b3848c4f2bed144894e886) - Rate Limiter bursts earlier now.

Improved Rate Limit class. This reduces execution time to the expected time..

```javascript
var num = 45 // # of requests

function count(err, data) {
  if (data) --num
  if (err) console.error(err)
  if (num == 0) console.timeEnd('api')
}

console.time('api')
for (var i = 0; i < 15; ++i) {
  k.Champion.list('na', count)
  k.Champion.list('kr', count)
  k.Champion.list('euw', count)
}
```
This should output something like ```api: 11820.972ms```.

Before this change, it was ```20789~ms``` which is not what it should be. The execution time when outside requests are sent is reduced too (it used to be ```40000~ms``` in this case; now it is around ```23741~ms``` if you send < 10 outside requests while this is running).

## [2.0.32](https://github.com/ChauTNguyen/kindred-api/commit/c798dfea68796f3b68d3256e60c972f921c56a90) - Calling static calls with just an object is fixed.

Many of my static calls that used object parameters bugged out when I tried doing something like this:

```javascript
k.Champion.all({ champListData: 'all' })
          .then(data => console.log(data))
          .catch(error => console.error(error))
```

The calls had old code where it only worked for when you only passed in a callback OR both an object and a callback.

All these parameter-related issues are now fixed.