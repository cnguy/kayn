import { expect, should, assert } from 'chai'

import TestUtils from '../../TestUtils'
const { kaynInstance, defaultConfig } = TestUtils

const { kayn, REGIONS, METHOD_TYPES } = kaynInstance
import StatusEndpoint from '../../../lib/Endpoints/StatusEndpoint'
import mocks from '../../mocks'

describe('StatusEndpoint', function() {
    this.timeout(0)

    beforeEach(function() {
        this.Status = new StatusEndpoint(defaultConfig)
    })

    describe('.get', function() {
        it('should have the correct payload #1', function() {
            const { payload } = this.Status.get()
            expect(payload).to.deep.equal({
                method: 'GET',
                serviceName: 'status',
                endpoint: 'shard-data',
                query: [],
                region: '',
                isTournament: false,
                version: 3,
                apiURLPrefix: 'https://%s.api.riotgames.com',
            })
        })
    })
})
