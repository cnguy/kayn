import { expect, should, assert } from 'chai'

import TestUtils from '../../../TestUtils'
const { kaynInstance, defaultConfig } = TestUtils

const { kayn, REGIONS, METHOD_TYPES } = kaynInstance
import LeaguePositionsEndpointV4 from '../../../../lib/Endpoints/LeagueEndpoint/LeaguePositionsEndpointV4'
import mocks from '../../../mocks'

describe('LeaguePositionsEndpointV4', function() {
    this.timeout(0)

    beforeEach(function() {
        this.LeaguePositions = new LeaguePositionsEndpointV4(defaultConfig)
    })

    describe('.by.summonerID', function() {
        it('should have the correct payload #1', function() {
            const { payload } = this.LeaguePositions.by.summonerID(
                'encryptedSummonerId',
            )
            expect(payload).to.deep.equal({
                method: 'GET',
                serviceName: 'league',
                endpoint: 'positions/by-summoner/encryptedSummonerId',
                query: [],
                region: '',
                isTournament: false,
                version: 4,
            })
        })
    })
})
