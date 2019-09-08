import { expect, should, assert } from 'chai'

import TestUtils from '../../TestUtils'
const { kaynInstance, defaultConfig } = TestUtils

const { kayn, REGIONS, METHOD_TYPES } = kaynInstance
import TournamentEndpointV4 from '../../../lib/Endpoints/TournamentEndpointV4'
import mocks from '../../mocks'

describe('TournamentEndpointV4', function() {
    this.timeout(0)

    beforeEach(function() {
        this.Tournament = new TournamentEndpointV4(defaultConfig)
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
                version: 4,
                apiURLPrefix: 'https://%s.api.riotgames.com',
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
                version: 4,
                apiURLPrefix: 'https://%s.api.riotgames.com',
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
                version: 4,
                apiURLPrefix: 'https://%s.api.riotgames.com',
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
                version: 4,
                apiURLPrefix: 'https://%s.api.riotgames.com',
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
                version: 4,
                apiURLPrefix: 'https://%s.api.riotgames.com',
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
                version: 4,
                apiURLPrefix: 'https://%s.api.riotgames.com',
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
                version: 4,
                apiURLPrefix: 'https://%s.api.riotgames.com',
            })
        })
    })
})
