const expect = require('chai').expect;
const sinon = require('sinon');
const tk = require('timekeeper');
const nock = require('nock');

let web3Service = require('../../../lib/web3Service');

describe('web3Service', function web3ServiceTest() {

  describe('getGasPrice', function getGasPriceTest() {

    before(function beforeTest() {
      nock('https://api.blockcypher.com')
        .get("/v1/eth/main")
        .times(3)
        .reply(200, { "high_gas_price": 10 * 10 ** 9 });
    });

    it('high', async function it() {
      let gasPrice = await web3Service.getGasPrice("high");
      expect(gasPrice).to.equal(10 * 10 ** 9);
    });

    it('medium', async function it() {
      let gasPrice = await web3Service.getGasPrice("medium");
      expect(gasPrice).to.equal(8 * 10 ** 9);
    });

    it('low', async function it() {
      let gasPrice = await web3Service.getGasPrice("low");
      expect(gasPrice).to.equal(6 * 10 ** 9);
    });

    after(function afterTest() {
      nock.cleanAll();
    });

  });

});

