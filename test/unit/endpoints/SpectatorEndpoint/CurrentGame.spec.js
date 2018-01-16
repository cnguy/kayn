import { expect, should, assert } from 'chai'

import TestUtils from '../../../TestUtils'
const { kaynInstance, defaultConfig } = TestUtils

const { kayn, REGIONS, METHOD_TYPES } = kaynInstance
import CurrentGameEndpoint from '../../../../lib/Endpoints/SpectatorEndpoint/CurrentGameEndpoint'
import mocks from '../../../mocks'

describe('CurrentGameEndpoint', function() {
    this.timeout(0)

    beforeEach(function() {
        this.CurrentGame = new CurrentGameEndpoint(defaultConfig)
    })

    describe('.by.summonerID', function() {
        it('should have the correct payload #1', function() {
            const { Contractz } = mocks.summoner
            const { payload } = this.CurrentGame.by.summonerID(Contractz.id)
            expect(payload).to.deep.equal({
                method: 'GET',
                serviceName: 'spectator',
                endpoint: `active-games/by-summoner/${Contractz.id}`,
                query: [],
                region: '',
                isTournament: false,
            })
        })
    })
})
