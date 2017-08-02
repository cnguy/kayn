/// <reference path='index.d.ts' />

import * as lolapi from 'kindred-api';
require('dotenv').config({ path: '../.env' })

const k = new lolapi.Kindred({
    key: process.env.KEY,
    // limits: lolapi.LIMITS.PROD
});

k.Summoner.get({ name: "Contractz" }, function (err, data) {
    if (err) {
        console.log(err);
    } else {
        console.log(data);
    }
})


console.log(k)