import { expect, should, assert } from 'chai'

import URLHelper from '../../../lib/Utils/URLHelper'
import mocks from '../../mocks'

describe('URLHelper', function() {
    describe('stringifyOptions', function() {
        it('should be empty string with no options', function() {
            const { none: opts } = mocks.options
            const actual = URLHelper.stringifyOptions(opts)
            expect(actual).to.equal('')
        })
        it('should be correct with single option', function() {
            const { single: opts } = mocks.options
            const actual = URLHelper.stringifyOptions(opts)
            expect(actual).to.equal('name=Contractz')
        })
        it('should be correct with multiple options', function() {
            const { multiple: opts } = mocks.options
            const actual = URLHelper.stringifyOptions(opts)
            expect(actual).to.equal('name=poz&rank=challenger')
        })
    })

    describe('getQueryParamString', function() {
        it('should get the correct query param string', function() {
            const { multiple: opts } = mocks.options
            const arrayOfOpts = Object.keys(opts).map(k => ({ [k]: opts[k] }))
            const actual = URLHelper.getQueryParamString(arrayOfOpts)
            expect(actual).to.equal('?name=poz&rank=challenger')
        })

        it('should get the encoded string', function() {
            const { multipleEncoded: opts } = mocks.options
            const arrayOfOpts = Object.keys(opts).map(k => ({ [k]: opts[k] }))
            const actual = URLHelper.getQueryParamString(arrayOfOpts)
            expect(actual).to.equal('?name=T%C3%A9st&rank=%C3%B3h%20no')
        })
    })
})
