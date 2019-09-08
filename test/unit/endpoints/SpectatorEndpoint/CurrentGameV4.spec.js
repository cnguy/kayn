import { expect, should, assert } from 'chai'

import TestUtils from '../../../TestUtils'
const { kaynInstance, defaultConfig } = TestUtils

const { kayn, REGIONS, METHOD_TYPES } = kaynInstance
import CurrentGameEndpointV4 from '../../../../lib/Endpoints/SpectatorEndpoint/CurrentGameEndpointV4'
import mocks from '../../../mocks'

describe('CurrentGameEndpointV4', function() {
    this.timeout(0)

    beforeEach(function() {
        this.CurrentGame = new CurrentGameEndpointV4(defaultConfig)
    })

    describe('.by.summonerID', function() {
        it('should have the correct payload #1', function() {
            const { payload } = this.CurrentGame.by.summonerID('abcdefg')
            expect(payload).to.deep.equal({
                method: 'GET',
                serviceName: 'spectator',
                endpoint: 'active-games/by-summoner/abcdefg',
                query: [],
                region: '',
                isTournament: false,
                version: 4,
                apiURLPrefix: 'https://%s.api.riotgames.com',
            })
        })
    })
})
