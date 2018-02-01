import { expect, should, assert } from 'chai'

import TestUtils from '../../TestUtils'

const { kayn } = TestUtils.kaynInstance

import challengerLeague from '../../fixtures/rest/league/challenger_league.json'

describe.skip('Challenger (integration)', function() {
    it('should work', async function() {
        const queue = 'RANKED_SOLO_5x5'
        const l = await kayn.Challenger.list(queue)
        expect(l.name).to.equal(challengerLeague.name)
        expect(l.tier).to.equal(challengerLeague.tier)
        expect(l.queue).to.equal(challengerLeague.queue)
        expect(l.queue).to.equal(queue)
        expect(challengerLeague.queue).to.equal(queue)
        expect(l.leagueId).to.equal(challengerLeague.leagueId)
        expect(l.entries.length).to.equal(200)
        expect(l.entries.length).to.equal(challengerLeague.entries.length)
    })

    it('should return 400 (BAD REQUEST) on bad queue', async function() {
        try {
            const queue = 'chain'
            const l = await kayn.Challenger.list(queue)
        } catch ({ statusCode }) {
            expect(statusCode).to.equal(400)
        }
    })
})
