From here onwards I'll try to adhere to [Semantic Versioning](http://semver.org). I kinda messed up early, and so it ended up as 2.0 (lol). Sorry guys!

[TODO](https://github.com/ChauTNguyen/kindred-api/blob/master/TODO.md) to view future changes.

# 2.0.35
* Fixed setRegion. It had a guaranteed exit function previously (brainfart).

* Converted process.exit(1)'s into throws for testing purposes.

* Added basic tests! Will be adding more as I have more time.

# 2.0.34

v3 API endpoints are back to accepting param=x&param=y style strings, and so I reverted how baseRequest works.

v3 urls are now in the following form:

```
https://na1.api.riotgames.com/lol/match/v3/matchlists/by-account/47776491?queue=420&queue=440&champion=81&api_key=<api_key>
```

instead of:

```
https://na1.api.riotgames.com/lol/match/v3/matchlists/by-account/47776491?queue=420,440&champion=81&api_key=<api_key>
```

# 2.0.33

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

# 2.0.32

Many of my static calls that used object parameters bugged out when I tried doing something like this:

```javascript
k.Champion.all({ champListData: 'all' })
          .then(data => console.log(data))
          .catch(error => console.error(error))
```

The calls had old code where it only worked for when you only passed in a callback OR both an object and a callback.

All these parameter-related issues are now fixed.