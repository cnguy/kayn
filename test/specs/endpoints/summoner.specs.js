require('../in-memory-cache.specs.js')

var chai = require('chai')

var expect = chai.expect,
    should = chai.should,
    assert = chai.assert

require('dotenv').config()

var init = require('../../../utils/init')

describe('Summoner', function() {
  it('(object-param) get fails on empty', () => {
    assert.throws(() => init().Summoner.get(), Error)
  })

  it('(standard-param) by.id fails on empty', () => {
    assert.throws(() => init().Summoner.by.id(), Error)
  })

  it('(standard-param) by.name fails on empty', () => {
    assert.throws(() => init().Summoner.by.name(), Error)
  })

  it('(standard-param) by.account fails on empty', () => {
    assert.throws(() => init().Summoner.by.account(), Error)
  })
})