// Check if code is same as what I specify in file!
function verify(theirCode) {
    return theirCode === 'chau'
}

function main(kayn) {
    kayn.SummonerV4.by
        .name('9 5 mcdonalds')
        .callback(function(error, summoner) {
            kayn.ThirdPartyCodeV4.by
                .summonerID(summoner.id)
                .callback(function(error, code) {
                    console.log(verify(code))
                })
        })
}

module.exports = main
