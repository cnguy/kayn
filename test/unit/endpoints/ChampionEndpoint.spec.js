import { expect, should, assert } from 'chai'

import TestUtils from '../../TestUtils'
const { kaynInstance, defaultConfig } = TestUtils

const { kayn, REGIONS, METHOD_TYPES } = kaynInstance
import ChampionEndpoint from '../../../lib/Endpoints/ChampionEndpoint'
import mocks from '../../mocks'

describe('ChampionEndpoint', function() {
    this.timeout(0)

    beforeEach(function() {
        this.Champion = new ChampionEndpoint(defaultConfig)
    })

    describe('.get', function() {
        it('should have the correct payload #1', function() {
            const championID = 67
            const { payload } = this.Champion.get(championID)
            expect(payload).to.deep.equal({
                method: 'GET',
                serviceName: 'platform',
                endpoint: `champions/${championID}`,
                query: [],
                region: '',
                isTournament: false,
            })
        })
    })
})
