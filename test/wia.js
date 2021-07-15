const { expect } = require('chai');
// const testUtils = require('./testUtils');
const Wia = require('../wia');

describe('Wia', () => {
  before((done) => {
    done();
  });

  describe('#createAppKeyWiaInstance', () => {
    it('should create an instance of wia using app key', (done) => {
      const wia = new Wia({
        appKey: 'wia-test-app-key',
      });

      const headers = wia.getHeaders();
      expect(headers).to.exist;
      expect(headers['x-app-key']).to.exist;
      done();
    });
  });

  describe('#createMultipleInstances', () => {
    it('should create multiple instances', (done) => {
      const secretKeyOne = 'abcdef';
      const wiaOne = new Wia({
        secretKey: secretKeyOne,
      });

      expect(wiaOne.getAccessToken()).to.exist;
      expect(wiaOne.getAccessToken()).to.equal(secretKeyOne);

      const secretKeyTwo = '123456';
      const wiaTwo = new Wia({
        secretKey: secretKeyTwo,
      });

      expect(wiaTwo.getAccessToken()).to.exist;
      expect(wiaTwo.getAccessToken()).to.equal(secretKeyTwo);

      done();
    });
  });

  after((done) => {
    done();
  });
});
