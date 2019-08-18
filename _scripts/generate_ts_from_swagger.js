import request from 'request'
const sw2dts = require('sw2dts')
import fs from 'fs'
import path from 'path'

import SWAGGER_URL from './swagger_url'

const TS_FILE_PATH = path.join(__dirname, '..', 'typings', 'dtos.ts')

request(SWAGGER_URL, (err, res) => {
    if (res) {
        const body = res.body.replace(new RegExp('Dto', 'g'), 'DTO', -1)
        sw2dts.convert(JSON.parse(body)).then(data => {
            fs.writeFileSync(TS_FILE_PATH, data)
            console.log('done')
        })
    }
})
