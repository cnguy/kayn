function main(kayn) {
    kayn.Match.get(2877485196).callback(function(err, match) {
        var bans = match.teams
            .map(function(m) {
                return m.bans
            })
            .reduce(function(t, c) {
                return t.concat(c)
            }, [])
        var ids = bans.map(function(b) {
            return b.championId
        })
        kayn.DDragon.Champion.listDataByIdWithParentAsId().callback(function(
            err,
            list,
        ) {
            var champions = []
            for (var i = 0; i < ids.length; ++i) {
                champions.push(list.data[ids[i]])
            }
            console.log(champions)
        })
    })
}

module.exports = main
