// Check if code is same as what I specify in file!
const verify = theirCode => theirCode === 'chau'

const main = async kayn => {
    const { id: myID } = await kayn.SummonerV4.by.name('9 5 mcdonalds')
    const code = await kayn.ThirdPartyCodeV4.by.summonerID(myID)
    console.log(verify(code))
}

module.exports = main
