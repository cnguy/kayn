var chai = require('chai')

var expect = chai.expect,
    should = chai.should,
    assert = chai.assert

require('dotenv').config()

describe('Core', function() {
  it('Kindred exists', () => expect(
      require('../../dist/kindred-api.min')
  ).is.not.undefined )

  it('it should not init thru standard init with 0 args', () => {
    const api = require('../../dist/kindred-api.min')
    const { REGIONS } = api
    const debug = true

    assert.throws(() => new api.Kindred(), Error)
  })

  it('it can init thru quickstart (3 params)', () => {
    const api = require('../../dist/kindred-api.min')
    const { REGIONS } = api
    const debug = true

    const k = api.QuickStart(process.env.KEY, REGIONS.NORTH_AMERICA, true)

    expect(k).is.not.undefined
  })

  it('it can init thru quickstart (2 params: key, region)', () => {
    const api = require('../../dist/kindred-api.min')
    const { REGIONS } = api

    const k = api.QuickStart(process.env.KEY, REGIONS.NORTH_AMERICA)

    expect(k).is.not.undefined
  })

  it('it can init thru quickstart (2 params: key, debug)', () => {
    const api = require('../../dist/kindred-api.min')
    const { REGIONS } = api

    const k = api.QuickStart(process.env.KEY, true)

    expect(k).is.not.undefined
  })

  it('it returns a promise', () => {
    const api = require('../../dist/kindred-api.min')
    const { REGIONS } = api
    debug = true

    const k = api.QuickStart(process.env.KEY, REGIONS.NORTH_AMERICA, true)

    assert.instanceOf(k.Summoner.get({ id: 32932398 }), Promise, 'this is a promise')
  })
})