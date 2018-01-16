import { expect, should, assert } from 'chai'

import TestUtils from '../../TestUtils'
const { kaynInstance, defaultConfig } = TestUtils

const { kayn, REGIONS, METHOD_TYPES } = kaynInstance
import SummonerEndpoint from '../../../lib/Endpoints/SummonerEndpoint'
import mocks from '../../mocks'

describe('SummonerEndpoint', function() {
    this.timeout(0)

    beforeEach(function() {
        this.Summoner = new SummonerEndpoint(defaultConfig)
    })

    describe('.by.name', function() {
        it('should have the correct payload #1', function() {
            const { payload } = this.Summoner.by.name(
                mocks.summoner.Contractz.name,
            )
            expect(payload).to.deep.equal({
                method: 'GET',
                serviceName: 'summoner',
                endpoint: `summoners/by-name/${mocks.summoner.Contractz.name}`,
                query: [],
                region: '',
                isTournament: false,
            })
        })

        it('should encode the summoner name', function() {
            const { payload } = this.Summoner.by.name(
                mocks.summoner.ShouldEncode,
            )
            const { endpoint } = payload
            expect(endpoint).to.equal('summoners/by-name/%5Bobject%20Object%5D')
        })
    })

    describe('.by.id', function() {
        it('should have the correct payload #1', function() {
            const { payload } = this.Summoner.by.id(mocks.summoner.Contractz.id)
            expect(payload).to.deep.equal({
                method: 'GET',
                serviceName: 'summoner',
                endpoint: `summoners/${mocks.summoner.Contractz.id}`,
                query: [],
                region: '',
                isTournament: false,
            })
        })
    })

    describe('.by.accountID', function() {
        it('should have the correct payload #1', function() {
            const { payload } = this.Summoner.by.accountID(
                mocks.summoner.Contractz.accountId,
            )
            expect(payload).to.deep.equal({
                method: 'GET',
                serviceName: 'summoner',
                endpoint: `summoners/by-account/${
                    mocks.summoner.Contractz.accountId
                }`,
                query: [],
                region: '',
                isTournament: false,
            })
        })
    })
})
