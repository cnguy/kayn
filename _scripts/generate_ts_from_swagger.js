const request = require('request')
const sw2dts = require('sw2dts')
const fs = require('fs')
const path = require('path')

const SWAGGER_URL = 'http://mingweisamuel.com/riotapi-schema/swaggerspec-2.0.json'
const TS_FILE_PATH = path.join(__dirname, '..', 'typings', 'dtos.ts')

request(SWAGGER_URL, (err, res) => {
    if (res) {
        sw2dts.convert(JSON.parse(res.body))
            .then(data => {
                fs.writeFileSync(TS_FILE_PATH, data);
            })
            .then(data => console.log('done'))
            .catch(err => console.log(err))
    }
})