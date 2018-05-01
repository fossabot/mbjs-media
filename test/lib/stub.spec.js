const { Stub } = require('../../src')

describe('Stub', () => {
  it('is being a stub', () => {
    const stub = new Stub()
    stub.whoami.should.equal('I am just a stub.')
  })
})
