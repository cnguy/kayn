import { expect, should, assert } from 'chai'

import TestUtils from '../../../TestUtils'
const { kaynInstance, defaultConfig } = TestUtils

import DDragonRealmEndpoint from '../../../../lib/Endpoints/DDragonEndpoints/DDragonRealmEndpoint'
import mocks from '../../../mocks'

describe('DDragonRealmEndpoint', function() {
    this.timeout(0)

    beforeEach(function() {
        this.DDragonRealmEndpoint = new DDragonRealmEndpoint(defaultConfig)
    })

    describe('.list', function() {
        it('should have the correct payload #1', function() {
            const { payload } = this.DDragonRealmEndpoint.list('euw')
            expect(payload).to.deep.equal({
                endpoint: 'euw.json',
                version: '', // irrelevant
                locale: '', // irrelevant
                region: '', // irrelevant
                type: 'realms',
            })
        })

        it('should have the correct default region #1', function() {
            const { payload } = this.DDragonRealmEndpoint.list()
            expect(payload).to.deep.equal({
                endpoint: 'na.json',
                version: '', // irrelevant
                locale: '', // irrelevant
                region: '', // irrelevant
                type: 'realms',
            })
        })
    })
})
