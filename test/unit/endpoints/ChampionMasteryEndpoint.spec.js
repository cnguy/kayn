import { expect, should, assert } from 'chai'

import TestUtils from '../../TestUtils'
const { kaynInstance, defaultConfig } = TestUtils

const { kayn, REGIONS, METHOD_TYPES } = kaynInstance
import ChampionMasteryEndpoint from '../../../lib/Endpoints/ChampionMasteryEndpoint'
import mocks from '../../mocks'

describe('ChampionMasteryEndpoint', function() {
    this.timeout(0)

    beforeEach(function() {
        this.ChampionMastery = new ChampionMasteryEndpoint(defaultConfig)
    })

    describe('.get', function() {
        it('should have the correct payload #1', function() {
            const championID = 67
            const { Contractz } = mocks.summoner
            const { payload } = this.ChampionMastery.get(Contractz.id)(
                championID,
            )
            expect(payload).to.deep.equal({
                method: 'GET',
                serviceName: 'champion-mastery',
                endpoint: `champion-masteries/by-summoner/${
                    Contractz.id
                }/by-champion/${championID}`,
                query: [],
                region: '',
                isTournament: false,
            })
        })
    })
})
