import request from 'request'
const sw2dts = require('sw2dts')
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

import SWAGGER_URL from './swagger_url'

const TS_FILE_PATH = path.join(__dirname, '..', 'typings', 'dtos.ts')

// Remove this later
try {
    const config = yaml.safeLoad(
        fs.readFileSync('./_scripts/swaggerspec-2.0.yml', 'utf8'),
    )
    const indentedJson = JSON.stringify(config, null, 4)
    sw2dts.convert(JSON.parse(indentedJson)).then(data => {
        fs.writeFileSync(TS_FILE_PATH, data)
        console.log('done')
    })
} catch (e) {
    console.log(e)
}

/*
request(SWAGGER_URL, (err, res) => {
    if (res) {
        sw2dts.convert(JSON.parse(res.body)).then(data => {
            fs.writeFileSync(TS_FILE_PATH, data)
            console.log('done')
        })
    }
})
*/
