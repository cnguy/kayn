const request = require('request')
const sw2dts = require('sw2dts')

const SWAGGER_URL = 'http://mingweisamuel.com/riotapi-schema/swaggerspec-2.0.json'

const options = {
    namespace: 'kayn',
    withQuery: true,
}

request(SWAGGER_URL, function (err, res) {
    if (res) {
        sw2dts.convert(JSON.parse(res.body), options)
            .then(data => console.log(data))
            .catch(err => console.log(err))
    }
})