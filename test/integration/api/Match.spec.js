import { expect, should, assert } from 'chai'

import TestUtils from '../../TestUtils'

const { kayn } = TestUtils.kaynInstance

import match from '../../fixtures/rest/match/match.json'
import koreaMatch from '../../fixtures/rest/match/match_korea.json'

describe.skip('Match (integration)', function() {
    this.timeout(10000)

    it('should work', async function() {
        const m = await kayn.Match.get(2685891793)
        expect(m).to.deep.equal(match)
    })

    it('should work #2', async function() {
        const m = await kayn.Match.get(3066040334).region('kr')
        expect(m).to.deep.equal(koreaMatch)
        expect(m.platformId).to.equal('KR')
    })
})
