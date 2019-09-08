import { expect, should, assert } from 'chai'

import TestUtils from '../../TestUtils'
const { kaynInstance, defaultConfig } = TestUtils

const { kayn, REGIONS, METHOD_TYPES } = kaynInstance
import SummonerEndpointV4 from '../../../lib/Endpoints/SummonerEndpointV4'
import mocks from '../../mocks'

describe('SummonerEndpointV4', function() {
    this.timeout(0)

    beforeEach(function() {
        this.Summoner = new SummonerEndpointV4(defaultConfig)
    })

    describe('.by.name', function() {
        it('should have the correct payload #1', function() {
            const { payload } = this.Summoner.by.name(
                mocks.summoner.Contractz.name,
            )
            expect(payload).to.deep.equal({
                method: 'GET',
                serviceName: 'summoner',
                endpoint: `summoners/by-name/${mocks.summoner.Contractz.name}`,
                query: [],
                region: '',
                isTournament: false,
                version: 4,
                apiURLPrefix: 'https://%s.api.riotgames.com',
            })
        })

        it('should encode the summoner name', function() {
            const { payload } = this.Summoner.by.name(
                mocks.summoner.ShouldEncode,
            )
            const { endpoint } = payload
            expect(endpoint).to.equal('summoners/by-name/%5Bobject%20Object%5D')
        })
    })
})
