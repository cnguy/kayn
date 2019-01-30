import request from 'request'
import findInFiles from 'find-in-files'
import path from 'path'
import fs from 'fs'
import svgToPng from 'svg-to-png'

import SWAGGER_URL from './swagger_url'

const notDone = []

const ENDPOINTS_DIR_PATH = path.join(__dirname, '..', 'lib', 'Endpoints')
const PICTURES_PATH = path.join(__dirname, '..', '_pictures')
const API_COV_SVG_BTN_PATH = path.join(PICTURES_PATH, 'api_cov.svg')

const getBadgePath = percentage =>
    `https://img.shields.io/badge/API_Coverage-${encodeURI(
        percentage,
    )}-9C27B0.svg`
const roundToHundredths = percentage => Math.round(100 * percentage) / 100
const flatten = array => array.reduce((total, curr) => total.concat(curr), [])
const processSvg = async () => {
    await svgToPng.convert(API_COV_SVG_BTN_PATH, PICTURES_PATH)
    fs.unlink(API_COV_SVG_BTN_PATH, err => {
        if (err) throw err
        console.log('done')
        console.log(notDone)
    })
}

const incrementIfExists = (total, curr) => (curr ? total + 1 : total)

request(SWAGGER_URL, async (err, res) => {
    if (res) {
        const { paths } = JSON.parse(res.body)
        const pathsKeys = Object.keys(paths)

        const resultsPromises = Promise.all(
            pathsKeys.map(async pathKey => {
                const methodTypes = Object.keys(paths[pathKey]).filter(
                    t => t === 'get',
                )
                const tmp = await Promise.all(
                    methodTypes.map(async k => {
                        const targetEndpoint = `${k.toUpperCase()} \`${pathKey}\``
                        const f = await findInFiles.find(
                            targetEndpoint,
                            ENDPOINTS_DIR_PATH,
                            '.js',
                        )
                        if (Object.keys(f).length === 0)
                            notDone.push(targetEndpoint)
                        return Object.keys(f).length > 0
                    }),
                )
                return tmp
            }),
        )

        const results = flatten(await resultsPromises)

        const total = results.reduce(incrementIfExists, 0)
        const percentage = roundToHundredths(total / results.length)
        const readablePercentage = `${percentage * 100}%`
        const badgePath = getBadgePath(readablePercentage)

        request
            .get(badgePath)
            .pipe(fs.createWriteStream(API_COV_SVG_BTN_PATH))
            .on('close', processSvg)
    }
})
