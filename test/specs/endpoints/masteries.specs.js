require('../in-memory-cache.specs.js')

var chai = require('chai')

var expect = chai.expect,
    should = chai.should,
    assert = chai.assert

require('dotenv').config()

var init = require('../../../utils/init')

describe('Masteries', function() {
  it('(object-param) get fails on empty', () => {
    assert.throws(() => init().Masteries.get(), Error)
  })

  it('(standard-param) by.id fails on empty', () => {
    assert.throws(() => init().Masteries.by.id(), Error)
  })

  it('(standard-param) by.name fails on empty', () => {
    assert.throws(() => init().Masteries.by.name(), Error)
  })

  it('(standard-param) by.account fails on empty', () => {
    assert.throws(() => init().Masteries.by.account(), Error)
  })
})