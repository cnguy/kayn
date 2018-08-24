// Check if code is same as what I specify in file!
function verify(theirCode) {
    return theirCode === 'chau'
}

function main(kayn) {
    kayn.Summoner.by.name('pYang').callback(function(error, summoner) {
        kayn.ThirdPartyCode.by
            .summonerID(summoner.id)
            .callback(function(error, code) {
                console.log(verify(code))
            })
    })
}

module.exports = main
