const getEpochDefault = require('../../../src/helpers/get-epoch')
const getEpoch = getEpochDefault.default

var chai = require('chai')

var expect = chai.expect,
  should = chai.should,
  assert = chai.assert

describe('get epoch', function () {
  it('should return epoch ms from date', function () {
    expect(getEpoch(new Date(1136073000))).to.equal(1136073000)
  })

  it('should return epoch ms from date string', function () {
    expect(getEpoch('Tue Jan 13 1970 19:34:33 GMT-0800 (PST)')).to.equal(1136073000)
  })

  it('should return identical number from number', function () {
    expect(getEpoch(1136073000)).to.equal(1136073000)
  })

  it('should return 0 if else', function () {
    expect(getEpoch(true)).to.equal(0)
  })
})