import { expect, should, assert } from 'chai'

import TestUtils from '../../../TestUtils'
const { kaynInstance, defaultConfig } = TestUtils

const { kayn, REGIONS, METHOD_TYPES } = kaynInstance
import LeaguePositionsEndpoint from '../../../../lib/Endpoints/LeagueEndpoint/LeaguePositionsEndpoint'
import mocks from '../../../mocks'

describe('LeaguePositionsEndpoint', function() {
    this.timeout(0)

    beforeEach(function() {
        this.LeaguePositions = new LeaguePositionsEndpoint(defaultConfig)
    })

    describe('.by.summonerID', function() {
        it('should have the correct payload #1', function() {
            const { Contractz } = mocks.summoner
            const { payload } = this.LeaguePositions.by.summonerID(Contractz.id)
            expect(payload).to.deep.equal({
                method: 'GET',
                serviceName: 'league',
                endpoint: `positions/by-summoner/${Contractz.id}`,
                query: [],
                region: '',
                isTournament: false,
            })
        })
    })
})
