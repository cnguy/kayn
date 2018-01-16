import { expect, should, assert } from 'chai'

import TestUtils from '../../../TestUtils'
const { kaynInstance, defaultConfig } = TestUtils

const { kayn, REGIONS, METHOD_TYPES } = kaynInstance
import MatchEndpoint from '../../../../lib/Endpoints/MatchEndpoint/MatchEndpoint'
import mocks from '../../../mocks'

describe('MatchEndpoint', function() {
    this.timeout(0)

    beforeEach(function() {
        this.Match = new MatchEndpoint(defaultConfig)
    })

    describe('.get', function() {
        it('should have the correct payload #1', function() {
            const { id } = mocks.match
            const { payload } = this.Match.get(id)
            expect(payload).to.deep.equal({
                method: 'GET',
                serviceName: 'match',
                endpoint: `matches/${id}`,
                query: [],
                region: '',
                isTournament: false,
            })
        })
    })

    describe('.timeline', function() {
        it('should have the correct payload #1', function() {
            const { id } = mocks.match
            const { payload } = this.Match.timeline(id)
            expect(payload).to.deep.equal({
                method: 'GET',
                serviceName: 'match',
                endpoint: `timelines/by-match/${id}`,
                query: [],
                region: '',
                isTournament: false,
            })
        })
    })

    describe('Tournament', function() {
        describe('.listMatchIDs', function() {
            it('should have the correct payload #1', function() {
                const { payload } = this.Match.Tournament.listMatchIDs('12345')
                expect(payload).to.deep.equal({
                    method: 'GET',
                    serviceName: 'match',
                    endpoint: 'matches/by-tournament-code/12345/ids',
                    query: [],
                    region: '',
                    isTournament: false,
                })
            })
        })

        describe('.get', function() {
            it('should have the correct payload #1', function() {
                const { payload } = this.Match.Tournament.get(12345, '12345')
                expect(payload).to.deep.equal({
                    method: 'GET',
                    serviceName: 'match',
                    endpoint: 'matches/12345/by-tournament-code/12345',
                    query: [],
                    region: '',
                    isTournament: false,
                })
            })
        })
    })
})
