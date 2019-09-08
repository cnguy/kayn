import { expect, should, assert } from 'chai'

import TestUtils from '../../../TestUtils'
const { kaynInstance, defaultConfig } = TestUtils

const { kayn, REGIONS, METHOD_TYPES } = kaynInstance
import MatchlistEndpointV4 from '../../../../lib/Endpoints/MatchEndpoint/MatchlistEndpointV4'
import mocks from '../../../mocks'

describe('MatchlistEndpointV4', function() {
    this.timeout(0)

    beforeEach(function() {
        this.Matchlist = new MatchlistEndpointV4(defaultConfig)
    })

    describe('.by.accountID', function() {
        it('should have the correct payload #1', function() {
            const { payload } = this.Matchlist.by.accountID('abcdefg')
            expect(payload).to.deep.equal({
                method: 'GET',
                serviceName: 'match',
                endpoint: 'matchlists/by-account/abcdefg',
                query: [],
                region: '',
                isTournament: false,
                version: 4,
                apiURLPrefix: 'https://%s.api.riotgames.com',
            })
        })
    })

    describe('.Recent.by.accountID', function() {
        it('should have the correct payload #1', function() {
            const { payload } = this.Matchlist.Recent.by.accountID('abcdefg')
            expect(payload).to.deep.equal({
                method: 'GET',
                serviceName: 'match',
                endpoint: 'matchlists/by-account/abcdefg',
                query: [{ beginIndex: 0, endIndex: 20 }],
                region: '',
                isTournament: false,
                version: 4,
                apiURLPrefix: 'https://%s.api.riotgames.com',
            })
        })
    })
})
