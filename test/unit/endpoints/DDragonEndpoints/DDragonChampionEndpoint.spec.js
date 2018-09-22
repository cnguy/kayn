import { expect, should, assert } from 'chai'

import TestUtils from '../../../TestUtils'
const { kaynInstance, defaultConfig } = TestUtils

import DDragonChampionEndpoint from '../../../../lib/Endpoints/DDragonEndpoints/DDragonChampionEndpoint'
import mocks from '../../../mocks'

describe('DDragonChampionEndpoint', function() {
    this.timeout(0)

    beforeEach(function() {
        this.DDragonChampionEndpoint = new DDragonChampionEndpoint(
            defaultConfig,
        )
    })

    describe('.get', function() {
        it('should have the correct version and locale #1', function() {
            const { payload } = this.DDragonChampionEndpoint.get('Aatrox')
                .version('8.15.1')
                .locale('en_SG')
            expect(payload).to.deep.equal({
                endpoint: 'champion/Aatrox.json',
                version: '8.15.1',
                locale: 'en_SG',
                region: '',
                type: 'cdn_data',
            })
        })
    })

    describe('.list', function() {
        it('should have the correct version and locale #1', function() {
            const { payload } = this.DDragonChampionEndpoint.list()
                .version('8.15.1')
                .locale('en_SG')
            expect(payload).to.deep.equal({
                endpoint: 'champion.json',
                version: '8.15.1',
                locale: 'en_SG',
                region: '',
                type: 'cdn_data',
            })
        })
    })
})
