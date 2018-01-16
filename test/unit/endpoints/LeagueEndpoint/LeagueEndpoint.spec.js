import { expect, should, assert } from 'chai'

import TestUtils from '../../../TestUtils'
const { kaynInstance, defaultConfig } = TestUtils

const { kayn, REGIONS, METHOD_TYPES } = kaynInstance
import LeagueEndpoint from '../../../../lib/Endpoints/LeagueEndpoint/LeagueEndpoint'
import mocks from '../../../mocks'

describe('LeagueEndpoint', function() {
    this.timeout(0)

    beforeEach(function() {
        this.League = new LeagueEndpoint(defaultConfig)
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
            })
        })
    })
})
