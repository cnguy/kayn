import { expect, should, assert } from 'chai'

import TestUtils from '../../../TestUtils'
const { kaynInstance, defaultConfig } = TestUtils

const { kayn, REGIONS, METHOD_TYPES } = kaynInstance
import GrandmasterEndpointV4 from '../../../../lib/Endpoints/LeagueEndpoint/GrandmasterEndpointV4'
import mocks from '../../../mocks'

describe('GrandmasterEndpointV4', function() {
    this.timeout(0)

    beforeEach(function() {
        this.GrandmasterEndpoint = new GrandmasterEndpointV4(defaultConfig)
    })

    describe('.list', function() {
        it('should have the correct payload #1', function() {
            const { payload } = this.GrandmasterEndpoint.list('RANKED_SOLO_5x5')
            expect(payload).to.deep.equal({
                method: 'GET',
                serviceName: 'league',
                endpoint: 'grandmasterleagues/by-queue/RANKED_SOLO_5x5',
                query: [],
                region: '',
                isTournament: false,
                version: 4,
                apiURLPrefix: 'https://%s.api.riotgames.com',
            })
        })
    })
})
