import { expect, should, assert } from 'chai'

import TestUtils from '../../../TestUtils'
const { kaynInstance, defaultConfig } = TestUtils

const { kayn, REGIONS, METHOD_TYPES } = kaynInstance
import LeagueEndpointV4 from '../../../../lib/Endpoints/LeagueEndpoint/LeagueEndpointV4'
import mocks from '../../../mocks'

describe('LeagueEndpointV4', function() {
    this.timeout(0)

    beforeEach(function() {
        this.League = new LeagueEndpointV4(defaultConfig)
    })

    describe('.by.uuid', function() {
        it('should have the correct payload #1', function() {
            const { payload } = this.League.by.uuid(mocks.league.uuid)
            expect(payload).to.deep.equal({
                method: 'GET',
                serviceName: 'league',
                endpoint: `leagues/${mocks.league.uuid}`,
                query: [],
                region: '',
                isTournament: false,
                version: 4,
                apiURLPrefix: 'https://%s.api.riotgames.com',
            })
        })
    })
})
