import { expect, should, assert } from 'chai'

import TestUtils from '../../../TestUtils'
const { kaynInstance, defaultConfig } = TestUtils

const { kayn, REGIONS, METHOD_TYPES } = kaynInstance
import LeagueEntriesEndpointV4 from '../../../../lib/Endpoints/LeagueEndpoint/LeagueEntriesEndpointV4'
import mocks from '../../../mocks'

describe('LeagueEntriesEndpointV4', function() {
    this.timeout(0)

    beforeEach(function() {
        this.LeagueEntries = new LeagueEntriesEndpointV4(defaultConfig)
    })

    describe('.by.summonerID', function() {
        it('should have the correct payload #1', function() {
            const { payload } = this.LeagueEntries.by.summonerID('abcdefgh')
            expect(payload).to.deep.equal({
                method: 'GET',
                serviceName: 'league',
                endpoint: 'entries/by-summoner/abcdefgh',
                query: [],
                region: '',
                isTournament: false,
                version: 4,
                apiURLPrefix: 'https://%s.api.riotgames.com',
            })
        })

        it('should have the correct method name', function() {
            const { methodName } = this.LeagueEntries.by
                .summonerID('abcdefgh')
                .region('na')
            expect(methodName).to.equal(
                'LEAGUE.GET_LEAGUE_ENTRIES_BY_SUMMONER_ID_V4',
            )
        })
    })

    describe('.list', function() {
        it('should have the correct payload #1', function() {
            const { payload } = this.LeagueEntries.list(
                'RANKED_SOLO_5x5',
                'DIAMOND',
                'I',
            ).region('kr')
            expect(payload).to.deep.equal({
                method: 'GET',
                serviceName: 'league',
                endpoint: 'entries/RANKED_SOLO_5x5/DIAMOND/I',
                query: [],
                region: 'kr',
                isTournament: false,
                version: 4,
                apiURLPrefix: 'https://%s.api.riotgames.com',
            })
        })

        it('should have the correct method name', function() {
            const { methodName } = this.LeagueEntries.list(
                'RANKED_SOLO_5x5',
                'DIAMOND',
                'I',
            ).region('na')
            expect(methodName).to.equal(
                'LEAGUE.GET_LEAGUE_ENTRIES_BY_QUEUE_TIER_DIVISION_V4',
            )
        })
    })
})
