import { expect, should, assert } from 'chai'

import TestUtils from '../../TestUtils'
const { kaynInstance, defaultConfig } = TestUtils

const { kayn, REGIONS, METHOD_TYPES } = kaynInstance
import TournamentEndpoint from '../../../lib/Endpoints/TournamentEndpoint'
import mocks from '../../mocks'

describe('TournamentEndpoint', function() {
    this.timeout(0)

    beforeEach(function() {
        this.Tournament = new TournamentEndpoint(defaultConfig)
    })

    describe('.create', function() {
        it('should have the correct payload #1', function() {
            const { payload } = this.Tournament.create('578', {
                hello: 'world',
            })
            expect(payload).to.deep.equal({
                method: 'POST',
                serviceName: 'tournament',
                endpoint: 'codes',
                query: [{ tournamentId: '578' }],
                region: '',
                isTournament: true,
                body: { hello: 'world' },
            })
        })
    })

    describe('.update', function() {
        it('should have the correct payload #1', function() {
            const { payload } = this.Tournament.update('578', {
                hello: 'world',
            })
            expect(payload).to.deep.equal({
                method: 'PUT',
                serviceName: 'tournament',
                endpoint: 'codes/578',
                query: [],
                region: '',
                isTournament: true,
                body: { hello: 'world' },
            })
        })

        it('should throw on no body argument', function() {
            expect(() => this.Tournament.update('578')).to.throw()
        })

        it('should throw on empty body argument', function() {
            expect(() => this.Tournament.update('578', {})).to.throw()
        })
    })

    describe('.get', function() {
        it('should have the correct payload #1', function() {
            const { payload } = this.Tournament.get('578')
            expect(payload).to.deep.equal({
                method: 'GET',
                serviceName: 'tournament',
                endpoint: 'codes/578',
                query: [],
                region: '',
                isTournament: true,
            })
        })
    })

    describe('.register', function() {
        it('should have the correct payload #1', function() {
            const { payload } = this.Tournament.register(379)
            expect(payload).to.deep.equal({
                method: 'POST',
                serviceName: 'tournament',
                endpoint: 'tournaments',
                query: [],
                region: '',
                isTournament: true,
                body: { providerId: 379 },
            })
        })

        it('should have the correct payload #2', function() {
            const { payload } = this.Tournament.register(
                379,
                'My First Tournament',
            )
            expect(payload).to.deep.equal({
                method: 'POST',
                serviceName: 'tournament',
                endpoint: 'tournaments',
                query: [],
                region: '',
                isTournament: true,
                body: { providerId: 379, name: 'My First Tournament' },
            })
        })
    })

    describe('.registerProviderData', function() {
        it('should have the correct payload #1', function() {
            const { payload } = this.Tournament.registerProviderData(
                REGIONS.NORTH_AMERICA,
                'https://github.com/kayn',
            )
            expect(payload).to.deep.equal({
                method: 'POST',
                serviceName: 'tournament',
                endpoint: 'providers',
                query: [],
                region: '',
                isTournament: true,
                body: {
                    region: REGIONS.NORTH_AMERICA.toUpperCase(),
                    url: 'https://github.com/kayn',
                },
            })
        })
    })

    describe('.lobbyEvents', function() {
        it('should have the correct payload #1', function() {
            const { payload } = this.Tournament.lobbyEvents('379')
            expect(payload).to.deep.equal({
                method: 'GET',
                serviceName: 'tournament',
                endpoint: 'lobby-events/by-code/379',
                query: [],
                region: '',
                isTournament: true,
            })
        })
    })
})
