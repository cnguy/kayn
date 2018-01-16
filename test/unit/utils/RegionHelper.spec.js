import { expect, should, assert } from 'chai'

import RegionHelper from '../../../lib/Utils/RegionHelper'
const { asPlatformID, isValidRegion } = RegionHelper

describe('RegionHelper', function() {
    describe('asPlatformID', function() {
        it('should return respective platform ID', function() {
            expect(asPlatformID('na')).to.equal('na1')
            expect(asPlatformID('euw')).to.equal('euw1')
            expect(asPlatformID('lan')).to.equal('la1')
        })
    })

    describe('isValidRegion', function() {
        it('should return true', function() {
            expect(isValidRegion('na')).to.true
        })

        it('should return false', function() {
            expect(isValidRegion('euwsucks')).to.be.false
            expect(isValidRegion('na1')).to.be.false
        })
    })
})
