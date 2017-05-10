require('../core-utils.specs.js')

var chai = require('chai')

var expect = chai.expect,
    should = chai.should,
    assert = chai.assert

require('dotenv').config()

var init = require('../../../utils/init')

describe('Runes', function() {
  it('(object-param) get fails on empty', () => {
    assert.throws(() => init().Runes.get(), Error)
  })

  it('(standard-param) by.id fails on empty', () => {
    assert.throws(() => init().Runes.by.id(), Error)
  })

  it('(standard-param) by.name fails on empty', () => {
    assert.throws(() => init().Runes.by.name(), Error)
  })

  it('(standard-param) by.account fails on empty', () => {
    assert.throws(() => init().Runes.by.account(), Error)
  })
})