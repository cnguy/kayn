import { expect, should, assert } from 'chai'

import TestUtils from '../../../TestUtils'
const { kaynInstance, defaultConfig } = TestUtils

const { kayn, REGIONS, METHOD_TYPES } = kaynInstance
import StaticReforgedRunesEndpoint from '../../../../lib/Endpoints/StaticEndpoints/StaticReforgedRunes'
import mocks from '../../../mocks'

describe('StaticReforgedRunesEndpoint', function() {
    this.timeout(0)

    beforeEach(function() {
        this.StaticReforgedRunes = new StaticReforgedRunesEndpoint(
            defaultConfig,
        )
    })

    describe('.get', function() {
        it('should have the correct payload #1', function() {
            const { payload } = this.StaticReforgedRunes.get('123')
            expect(payload).to.deep.equal({
                method: 'GET',
                serviceName: 'static-data',
                endpoint: 'reforged-runes/123',
                query: [],
                region: '',
                isTournament: false,
            })
        })
    })

    describe('.list', function() {
        it('should have the correct payload #2', function() {
            const { payload } = this.StaticReforgedRunes.list()
            expect(payload).to.deep.equal({
                method: 'GET',
                serviceName: 'static-data',
                endpoint: 'reforged-runes',
                query: [],
                region: '',
                isTournament: false,
            })
        })
    })
})
