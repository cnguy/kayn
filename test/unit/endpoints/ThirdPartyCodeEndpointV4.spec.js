import { expect, should, assert } from 'chai'

import TestUtils from '../../TestUtils'
const { kaynInstance, defaultConfig } = TestUtils

const { kayn, REGIONS, METHOD_TYPES } = kaynInstance
import ThirdPartyCodeEndpointV4 from '../../../lib/Endpoints/ThirdPartyCodeEndpointV4'
import mocks from '../../mocks'

describe('ThirdPartyCodeEndpointV4', function() {
    this.timeout(0)

    beforeEach(function() {
        this.ThirdPartyCode = new ThirdPartyCodeEndpointV4(defaultConfig)
    })

    describe('.by.summonerID', function() {
        it('should have the correct payload #1', function() {
            const { payload } = this.ThirdPartyCode.by.summonerID('abcdefg')
            expect(payload).to.deep.equal({
                method: 'GET',
                serviceName: 'platform',
                endpoint: 'third-party-code/by-summoner/abcdefg',
                query: [],
                region: '',
                isTournament: false,
                version: 4,
                apiURLPrefix: 'https://%s.api.riotgames.com',
            })
        })
    })
})
