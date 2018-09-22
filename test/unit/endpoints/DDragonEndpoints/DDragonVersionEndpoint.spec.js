import { expect, should, assert } from 'chai'

import TestUtils from '../../../TestUtils'
const { kaynInstance, defaultConfig } = TestUtils

import DDragonVersionEndpoint from '../../../../lib/Endpoints/DDragonEndpoints/DDragonVersionEndpoint'
import mocks from '../../../mocks'

describe('DDragonVersionEndpoint', function() {
    this.timeout(0)

    beforeEach(function() {
        this.DDragonVersionEndpoint = new DDragonVersionEndpoint(defaultConfig)
    })

    describe('.list', function() {
        it('should have the correct payload #1', function() {
            const { payload } = this.DDragonVersionEndpoint.list()
            expect(payload).to.deep.equal({
                endpoint: 'versions.json',
                version: '', // irrelevant
                locale: '', // irrelevant
                region: '', // irrelevant
                type: 'api',
            })
        })
    })
})
