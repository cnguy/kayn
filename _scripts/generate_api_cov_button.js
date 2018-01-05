import request from 'request'
import findInFiles from 'find-in-files'
import path from 'path';
import fs from 'fs';

import SWAGGER_URL from './swagger_url'

const ENDPOINTS_DIR_PATH = path.join(__dirname, '..', 'lib', 'Endpoints')
const API_COV_BTN_PATH = path.join(__dirname, '..', '_pictures', 'api_cov.svg')

const getBadgePath = percentage =>
    `https://img.shields.io/badge/API_coverage-${encodeURI(percentage)}-9C27B0.svg`
const roundToHundredths = percentage => Math.round(100 * percentage) / 100

request(SWAGGER_URL, async (err, res) => {
    if (res) {
        const paths = Object.keys(JSON.parse(res.body).paths)
        const results = await Promise.all(paths.map(async path =>
            await findInFiles.find(`\`${path}\``, ENDPOINTS_DIR_PATH, '.js')
        ))
        const value = results.reduce((total, curr) =>
            Object.keys(curr).length === 1 
                ? total + curr[Object.keys(curr)[0]].count // TODO: Implement GET/POST/etc detection so this can be === 1. 
                : total
        , 0)
        const percentage = roundToHundredths(value / results.length)
        const readablePercentage = `${percentage * 100}%`
        const badgePath = getBadgePath(readablePercentage)

        request
            .get(badgePath)
            .pipe(fs.createWriteStream(API_COV_BTN_PATH))
            .on('close', () => console.log('done'))
    }
})