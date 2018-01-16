import { expect, should, assert } from 'chai'

import DateTimeHelper from '../../../lib/Utils/DateTimeHelper'
const { checkIfDateParam, getEpoch } = DateTimeHelper

describe('DateTimeHelper', function() {
    describe('checkIfDateParam', function() {
        it('should work for beginTime', function() {
            expect(checkIfDateParam('beginTime')).to.be.true
        })

        it('should work for endTime', function() {
            expect(checkIfDateParam('endTime')).to.be.true
        })

        it('should return false for incorrect tag', function() {
            expect(checkIfDateParam('abcdefghijklmnopqrstuvwxyz')).to.be.false
        })
    })

    describe('getEpoch', function() {
        it('should return epoch ms from date', function() {
            expect(getEpoch(new Date(1136073000))).to.equal(1136073000)
        })

        it('should return epoch ms from date string', function() {
            expect(
                getEpoch('Tue Jan 13 1970 19:34:33 GMT-0800 (PST)'),
            ).to.equal(1136073000)
        })

        it('should return identical number from number', function() {
            expect(getEpoch(1136073000)).to.equal(1136073000)
        })

        it('should return 0 if else', function() {
            expect(getEpoch(true)).to.equal(0)
        })
    })
})
