import { expect, should, assert } from 'chai'

import TestUtils from '../../TestUtils'

const { kayn } = TestUtils.kaynInstance

import simpleMatchlist from '../../fixtures/rest/match/matchlist_simple.json'
import modifiedIndicesMatchlist from '../../fixtures/rest/match/matchlist_modified_indices.json'
import modifiedTimesMatchlist from '../../fixtures/rest/match/matchlist_modified_times.json'

describe.skip('Matchlist (integration)', function() {
    it('should work for simple ranked request', async function() {
        const queue = 420
        const ml = await kayn.Matchlist.by.accountID(47776491)
        expect(ml.matches.length).to.equal(100)
        expect(ml.matches.length).to.equal(simpleMatchlist.matches.length)
        expect(ml.startIndex).to.equal(0)
        expect(ml.endIndex).to.equal(100)
        expect(ml.totalGames).to.be.at.least(simpleMatchlist.totalGames)
    })

    it('should work with different beginIndex and endIndex', async function() {
        const queue = 420
        const indexConfig = {
            beginIndex: 25,
            endIndex: 75,
        }
        // low `beginIndex` values seem to bug the totalGames.
        // we will ignore testing `totalGames` here.
        const ml = await kayn.Matchlist.by
            .accountID(47776491)
            .query(indexConfig)
        expect(ml.matches.length).to.equal(
            modifiedIndicesMatchlist.matches.length,
        )
        expect(ml.startIndex).to.equal(indexConfig.beginIndex)
        expect(ml.endIndex).to.equal(indexConfig.endIndex)
        expect(ml.startIndex).to.equal(modifiedIndicesMatchlist.startIndex)
        expect(ml.endIndex).to.equal(modifiedIndicesMatchlist.endIndex)
    })

    it('should work with different beginTime and endTime', async function() {
        const queue = 420
        const timeConfig = {
            beginTime: 1514734330000,
            endTime: 1514993592000,
        }
        const ml = await kayn.Matchlist.by
            .accountID(233871907)
            .query(timeConfig)

        expect(ml).to.deep.equal(modifiedTimesMatchlist)

        for (let i = 0; i < ml.matches.length; ++i) {
            expect(ml.matches[i].timestamp).to.be.at.least(timeConfig.beginTime)
            expect(ml.matches[i].timestamp).to.be.at.most(timeConfig.endTime)
        }
    })

    it('should throw 400 if beginTime and endTime are separated by more than a week', async function() {
        try {
            const queue = 420
            const verySeparatedTimeConfig = {
                beginTime: 1512315130000,
                endTime: 1514993592000,
            }
            const ml = await kayn.Matchlist.by
                .accountID(233871907)
                .query(verySeparatedTimeConfig)
        } catch ({ statusCode }) {
            expect(statusCode).to.equal(400)
        }
    })
})
