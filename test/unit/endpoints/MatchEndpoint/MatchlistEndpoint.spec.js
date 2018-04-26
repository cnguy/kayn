import { expect, should, assert } from 'chai'

import TestUtils from '../../../TestUtils'
const { kaynInstance, defaultConfig } = TestUtils

const { kayn, REGIONS, METHOD_TYPES } = kaynInstance
import MatchlistEndpoint from '../../../../lib/Endpoints/MatchEndpoint/MatchlistEndpoint'
import mocks from '../../../mocks'

describe('MatchlistEndpoint', function() {
    this.timeout(0)

    beforeEach(function() {
        this.Matchlist = new MatchlistEndpoint(defaultConfig)
    })

    describe('.by.accountID', function() {
        it('should have the correct payload #1', function() {
            const { payload } = this.Matchlist.by.accountID(
                mocks.summoner.Contractz.accountId,
            )
            expect(payload).to.deep.equal({
                method: 'GET',
                serviceName: 'match',
                endpoint: `matchlists/by-account/${
                    mocks.summoner.Contractz.accountId
                }`,
                query: [],
                region: '',
                isTournament: false,
            })
        })
    })

    describe('.Recent.by.accountID', function() {
        it('should have the correct payload #1', function() {
            const { payload } = this.Matchlist.Recent.by.accountID(
                mocks.summoner.Contractz.accountId,
            )
            const { Contractz } = mocks.summoner
            expect(payload).to.deep.equal({
                method: 'GET',
                serviceName: 'match',
                endpoint: `matchlists/by-account/${Contractz.accountId}`,
                query: [{ beginIndex: 0, endIndex: 20 }],
                region: '',
                isTournament: false,
            })
        })
    })
})
