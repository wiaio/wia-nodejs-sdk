'use strict';

const expect = require('chai').expect;
const testUtils = require('./testUtils');
const Wia = require('../wia');

describe('Wia', function () {
  before(function (done) {
      done();
  });

  describe('#createAppKeyWiaInstance', function () {
    it('should create an instance of wia using app key', function (done) {
      var wia = new Wia({
        appKey: "wia-test-app-key"
      });

      var headers = wia.getHeaders();
      expect(headers).to.exist;
      expect(headers['x-app-key']).to.exist;
      done();
    });
  });

  after(function (done) {
      done();
  });
});
