import { expect, should, assert } from 'chai'

import TestUtils from '../../../TestUtils'
const { kaynInstance, defaultConfig } = TestUtils

const { kayn, REGIONS, METHOD_TYPES } = kaynInstance
import FeaturedGamesEndpoint from '../../../../lib/Endpoints/SpectatorEndpoint/FeaturedGamesEndpoint'
import mocks from '../../../mocks'

describe('FeaturedGamesEndpoint', function() {
    this.timeout(0)

    beforeEach(function() {
        this.FeaturedGames = new FeaturedGamesEndpoint(defaultConfig)
    })

    describe('.list', function() {
        it('should have the correct payload #1', function() {
            const { payload } = this.FeaturedGames.list()
            expect(payload).to.deep.equal({
                method: 'GET',
                serviceName: 'spectator',
                endpoint: 'featured-games',
                query: [],
                region: '',
                isTournament: false,
            })
        })
    })
})
