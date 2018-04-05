import { expect, should, assert } from 'chai'

import TestUtils from '../../../TestUtils'
const { kaynInstance, defaultConfig } = TestUtils

const { kayn, REGIONS, METHOD_TYPES } = kaynInstance
import StaticTarballLinksEndpoint from '../../../../lib/Endpoints/StaticEndpoints/StaticTarballLinksEndpoint'
import mocks from '../../../mocks'

describe('StaticTarballLinksEndpoint', function() {
    this.timeout(0)

    beforeEach(function() {
        this.StaticTarballLinks = new StaticTarballLinksEndpoint(defaultConfig)
    })

    describe('.get', function() {
        it('should have the correct payload #1', function() {
            const { payload } = this.StaticTarballLinks.get()
            expect(payload).to.deep.equal({
                method: 'GET',
                serviceName: 'static-data',
                endpoint: 'tarball-links',
                query: [],
                region: '',
                isTournament: false,
            })
        })
    })
})
