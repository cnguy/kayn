import { expect, should, assert } from 'chai'

import TestUtils from '../../../TestUtils'
const { kaynInstance, defaultConfig } = TestUtils

const { kayn, REGIONS, METHOD_TYPES } = kaynInstance
import StaticReforgedRunePathsEndpoint from '../../../../lib/Endpoints/StaticEndpoints/StaticReforgedRunePaths'
import mocks from '../../../mocks'

describe('StaticReforgedRunePathsEndpoint', function() {
    this.timeout(0)

    beforeEach(function() {
        this.StaticReforgedRunePaths = new StaticReforgedRunePathsEndpoint(
            defaultConfig,
        )
    })

    describe('.get', function() {
        it('should have the correct payload #1', function() {
            const { payload } = this.StaticReforgedRunePaths.get('123')
            expect(payload).to.deep.equal({
                method: 'GET',
                serviceName: 'static-data',
                endpoint: 'reforged-rune-paths/123',
                query: [],
                region: '',
                isTournament: false,
            })
        })
    })

    describe('.list', function() {
        it('should have the correct payload #2', function() {
            const { payload } = this.StaticReforgedRunePaths.list()
            expect(payload).to.deep.equal({
                method: 'GET',
                serviceName: 'static-data',
                endpoint: 'reforged-rune-paths',
                query: [],
                region: '',
                isTournament: false,
            })
        })
    })
})
