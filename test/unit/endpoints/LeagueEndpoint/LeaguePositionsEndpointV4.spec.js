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

    describe('.list', function() {
        it('should have the correct payload #1', function() {
            const positionalQueue = 'RANKED_SOLO_5x5'
            const tier = 'DIAMOND'
            const division = 'I'
            const position = 'TOP'
            const page = 0
            const { payload } = this.LeaguePositions.list(
                positionalQueue,
                tier,
                division,
                position,
                page,
            )
            expect(payload).to.deep.equal({
                method: 'GET',
                serviceName: 'league',
                endpoint: `positions/${positionalQueue}/${tier}/${division}/${position}/${page}`,
                query: [],
                region: '',
                isTournament: false,
                version: 4,
            })
        })

        it('should have the correct payload #2', function() {
            const positionalQueue = 'RANKED_SOLO_5x5'
            const tier = 'GOLD'
            const division = 'I'
            const position = 'JUNGLE'
            const page = 1
            const { payload } = this.LeaguePositions.list(
                positionalQueue,
                tier,
                division,
                position,
                page,
            )
            expect(payload).to.deep.equal({
                method: 'GET',
                serviceName: 'league',
                endpoint: `positions/${positionalQueue}/${tier}/${division}/${position}/${page}`,
                query: [],
                region: '',
                isTournament: false,
                version: 4,
            })
        })

        it('should have the correct method name', function() {
            const positionalQueue = 'RANKED_SOLO_5x5'
            const tier = 'GOLD'
            const division = 'I'
            const position = 'JUNGLE'
            const page = 1
            const { methodName } = this.LeaguePositions.list(
                positionalQueue,
                tier,
                division,
                position,
                page,
            ).region('na')
            expect(methodName).to.equal(
                'LEAGUE.GET_ALL_POSITIONAL_LEAGUE_ENTRIES_V4',
            )
        })
    })
})
