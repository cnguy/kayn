import { expect, should, assert } from 'chai'

import TestUtils from '../../../TestUtils'
const { kaynInstance, defaultConfig } = TestUtils

const { kayn, REGIONS, METHOD_TYPES } = kaynInstance
import FeaturedGamesEndpointV4 from '../../../../lib/Endpoints/SpectatorEndpoint/FeaturedGamesEndpointV4'
import mocks from '../../../mocks'

describe('FeaturedGamesEndpointV4', function() {
    this.timeout(0)

    beforeEach(function() {
        this.FeaturedGames = new FeaturedGamesEndpointV4(defaultConfig)
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
                version: 4,
                apiURLPrefix: 'https://%s.api.riotgames.com',
            })
        })
    })
})
