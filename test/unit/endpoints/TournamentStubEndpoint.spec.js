import { expect, should, assert } from 'chai'

import TestUtils from '../../TestUtils'
const { kaynInstance, defaultConfig } = TestUtils

const { kayn, REGIONS, METHOD_TYPES } = kaynInstance
import TournamentStubEndpoint from '../../../lib/Endpoints/TournamentStubEndpoint'
import mocks from '../../mocks'

describe('TournamentStubEndpoint', function() {
    this.timeout(0)

    beforeEach(function() {
        this.TournamentStub = new TournamentStubEndpoint(defaultConfig)
    })

    describe('.create', function() {
        it('should have the correct payload #1', function() {
            const { payload } = this.TournamentStub.create('578', {
                hello: 'world',
            })
            expect(payload).to.deep.equal({
                method: 'POST',
                serviceName: 'tournament-stub',
                endpoint: 'codes',
                query: [{ tournamentId: '578' }],
                region: '',
                isTournament: true,
                body: { hello: 'world' },
                version: 3,
            })
        })
    })

    describe('.register', function() {
        it('should have the correct payload #1', function() {
            const { payload } = this.TournamentStub.register(379)
            expect(payload).to.deep.equal({
                method: 'POST',
                serviceName: 'tournament-stub',
                endpoint: 'tournaments',
                query: [],
                region: '',
                isTournament: true,
                body: { providerId: 379 },
                version: 3,
            })
        })

        it('should have the correct payload #2', function() {
            const { payload } = this.TournamentStub.register(
                379,
                'My First Tournament (Stub)',
            )
            expect(payload).to.deep.equal({
                method: 'POST',
                serviceName: 'tournament-stub',
                endpoint: 'tournaments',
                query: [],
                region: '',
                isTournament: true,
                body: { providerId: 379, name: 'My First Tournament (Stub)' },
                version: 3,
            })
        })
    })

    describe('.registerProviderData', function() {
        it('should have the correct payload #1', function() {
            const { payload } = this.TournamentStub.registerProviderData(
                REGIONS.NORTH_AMERICA,
                'https://github.com/kayn',
            )
            expect(payload).to.deep.equal({
                method: 'POST',
                serviceName: 'tournament-stub',
                endpoint: 'providers',
                query: [],
                region: '',
                isTournament: true,
                body: {
                    region: REGIONS.NORTH_AMERICA.toUpperCase(),
                    url: 'https://github.com/kayn',
                },
                version: 3,
            })
        })
    })

    describe('.lobbyEvents', function() {
        it('should have the correct payload #1', function() {
            const { payload } = this.TournamentStub.lobbyEvents('379')
            expect(payload).to.deep.equal({
                method: 'GET',
                serviceName: 'tournament-stub',
                endpoint: 'lobby-events/by-code/379',
                query: [],
                region: '',
                isTournament: true,
                version: 3,
            })
        })
    })
})
