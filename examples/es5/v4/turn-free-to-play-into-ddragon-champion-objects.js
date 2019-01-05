// Gets free champion ID's from the champion rotation endpoints
// and converts them to their respective DDragon champion objects.

function main(kayn) {
    kayn.ChampionRotation.list().callback(function(error1, res1) {
        if (!error1) {
            kayn.DDragon.Champion.list()
                .version('8.15.1')
                .callback(function(error2, res2) {
                    if (!error2) {
                        // res2.data is an object, not an array, so we require
                        // these keys to iterate over the array. This is an optimization (cached keys).
                        const keys = Object.keys(res2.data)
                        // For each champion ID within res1.freeChampionIds,
                        // find the correct DDragon champion object.
                        const champions = res1.freeChampionIds.map(function(
                            id,
                        ) {
                            for (let key of keys) {
                                if (parseInt(res2.data[key].key) === id) {
                                    return res2.data[key]
                                }
                            }
                        })
                        console.log(champions)
                    }
                })
        }
    })
}

module.exports = main
