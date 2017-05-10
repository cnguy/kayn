var chai = require('chai')

var expect = chai.expect,
    should = chai.should,
    assert = chai.assert

require('dotenv').config()

var init = require('../../utils/init')

describe('Core', function() {
  it('Kindred exists', () => expect(
      require('../../dist/kindred-api.min')
  ).is.not.undefined)

  it('it should not init thru standard init w/o api key (0 args)', () => {
    const api = require('../../dist/kindred-api.min')

    const { REGIONS } = api
    const debug = true

    assert.throws(() => new api.Kindred(), Error)
  })

  it('it should init thru standard init (3 args: key, region, debug)', () => {
    const api = require('../../dist/kindred-api.min')

    const region = api.REGIONS.NORTH_AMERICA
    const debug = true

    const k = new api.Kindred({
      key: process.env.KEY, region, debug
    })

    expect(k).is.not.undefined
  })

  it('it should init thru standard init (1 arg: key)', () => {
    const api = require('../../dist/kindred-api.min')

    const k = new api.Kindred({
      key: process.env.KEY
    })

    expect(k).is.not.undefined
  })

  it('it should init thru standard init (2 args: key, debug)', () => {
    const api = require('../../dist/kindred-api.min')

    const debug = true

    const k = new api.Kindred({
      key: process.env.KEY, debug
    })

    expect(k).is.not.undefined
  })

  it('it can init thru quickstart (3 args)', () => {
    expect(init()).is.not.undefined
  })

  it('it can init thru quickstart (2 args: key, region)', () => {
    const api = require('../../dist/kindred-api.min')
    const { REGIONS } = api

    const k = api.QuickStart(process.env.KEY, REGIONS.NORTH_AMERICA)

    expect(k).is.not.undefined
  })

  it('it can init thru quickstart (2 args: key, debug)', () => {
    const api = require('../../dist/kindred-api.min')
    const { REGIONS } = api

    const k = api.QuickStart(process.env.KEY, true)

    expect(k).is.not.undefined
  })

  it('it returns a promise', () => {
    assert.instanceOf(init().Summoner.get({ id: 32932398 }), Promise, 'this is a promise')
  })
})