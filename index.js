var Kindred = require('./dist/kindred-api')
var k = new Kindred('RGAPI-296F4E17-4CDC-46BD-A4D7-30EAAAE4D78C')

// // k._baseRequest('by-name/caaaaaaaaarIa', 'na', false)
// k._summonerRequest('by-name/caaaaaaaaarIa', function(err, data) {
//     if (err) console.log('err')
//     console.log(data)
// })

// console.log(k.getMasters('na'))
// k.getMasters('na', cb=function(err, data) {
//     console.log('err: ', err)
//     console.log("got the data.")
//     // k.getChallengers('na', 'RANKED_SOLO_5x5', function())
// })

k.getMasters({ region: 'na', cb: function(err,data) {
    if (err) console.log(err)
    console.log('got the data')
}})

k.getSummoners({ region: 'na', names: ['caaaaaaaaaria', 'Ri chelle'], cb: function(err, data) {
    console.log(data)
}})

k.getSummoners({ region: 'na', names: 'caaaaaaaaaria', cb: function(err, data) {
    console.log('caaaaaaaaarIa data:', data)
}})
