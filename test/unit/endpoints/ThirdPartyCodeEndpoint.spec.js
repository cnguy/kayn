import { expect, should, assert } from 'chai'

import TestUtils from '../../TestUtils'
const { kaynInstance, defaultConfig } = TestUtils

const { kayn, REGIONS, METHOD_TYPES } = kaynInstance
import ThirdPartyCodeEndpoint from '../../../lib/Endpoints/ThirdPartyCodeEndpoint'
import mocks from '../../mocks'

describe('ThirdPartyCodeEndpoint', function() {
    this.timeout(0)

    beforeEach(function() {
        this.ThirdPartyCode = new ThirdPartyCodeEndpoint(defaultConfig)
    })

    describe('.by.summonerID', function() {
        it('should have the correct payload #1', function() {
            const { payload } = this.ThirdPartyCode.by.summonerID(
                mocks.summoner.Contractz.id,
            )
            expect(payload).to.deep.equal({
                method: 'GET',
                serviceName: 'platform',
                endpoint: `third-party-code/by-summoner/${
                    mocks.summoner.Contractz.id
                }`,
                query: [],
                region: '',
                isTournament: false,
            })
        })
    })
})
