import { expect, should, assert } from 'chai'

import TestUtils from '../../TestUtils'
const { kaynInstance, defaultConfig } = TestUtils

const { kayn, REGIONS, METHOD_TYPES } = kaynInstance
import ChampionRotationEndpoint from '../../../lib/Endpoints/ChampionRotationEndpoint'
import mocks from '../../mocks'

describe('ChampionEndpoint', function() {
    this.timeout(0)

    beforeEach(function() {
        this.Champion = {}
        this.Champion.Rotation = new ChampionRotationEndpoint(defaultConfig)
    })

    describe('.Rotation.list', function() {
        it('should have the correct payload #1', function() {
            const { payload } = this.Champion.Rotation.list()
            expect(payload).to.deep.equal({
                method: 'GET',
                serviceName: 'platform',
                endpoint: `champion-rotations`,
                query: [],
                region: '',
                isTournament: false,
                version: 3,
                apiURLPrefix: 'https://%s.api.riotgames.com',
            })
        })
    })
})
