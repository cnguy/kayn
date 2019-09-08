import { expect, should, assert } from 'chai'

import TestUtils from '../../TestUtils'
const { kaynInstance, defaultConfig } = TestUtils

const { kayn, REGIONS, METHOD_TYPES } = kaynInstance
import ChampionMasteryEndpointV4 from '../../../lib/Endpoints/ChampionMasteryEndpointV4'
import mocks from '../../mocks'

describe('ChampionMasteryEndpointV4', function() {
    this.timeout(0)

    beforeEach(function() {
        this.ChampionMastery = new ChampionMasteryEndpointV4(defaultConfig)
    })

    describe('.get', function() {
        it('should have the correct payload #1', function() {
            const championID = 67
            const { payload } = this.ChampionMastery.get('abcdefg')(championID)
            expect(payload).to.deep.equal({
                method: 'GET',
                serviceName: 'champion-mastery',
                endpoint: `champion-masteries/by-summoner/abcdefg/by-champion/${championID}`,
                query: [],
                region: '',
                isTournament: false,
                version: 4,
                apiURLPrefix: 'https://%s.api.riotgames.com',
            })
        })
    })

    describe('.list', function() {
        it('should have the correct payload #1', function() {
            const { payload } = this.ChampionMastery.list('abcdefg')
            expect(payload).to.deep.equal({
                method: 'GET',
                serviceName: 'champion-mastery',
                endpoint: 'champion-masteries/by-summoner/abcdefg',
                query: [],
                region: '',
                isTournament: false,
                version: 4,
                apiURLPrefix: 'https://%s.api.riotgames.com',
            })
        })
    })

    describe('.totalScore', function() {
        it('should have the correct payload #1', function() {
            const { payload } = this.ChampionMastery.totalScore('abcdefg')
            expect(payload).to.deep.equal({
                method: 'GET',
                serviceName: 'champion-mastery',
                endpoint: 'scores/by-summoner/abcdefg',
                query: [],
                region: '',
                isTournament: false,
                version: 4,
                apiURLPrefix: 'https://%s.api.riotgames.com',
            })
        })
    })
})
