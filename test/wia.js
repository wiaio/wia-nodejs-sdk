'use strict';

var expect = require('chai').expect;
var testUtils = require('./testUtils');
var Wia = require('../wia');

describe('Wia', function () {
  before(function (done) {
      done();
  });

  describe('#getClientUserAgent', function () {
    it('should get client user agent', function (done) {
      var wia = new Wia(testUtils.getUserSecretKey());

      wia.getClientUserAgent(function(userAgent) {
        expect(userAgent).to.exist;
        done();
      });
    });
  });

  describe('#getClientUserAgentAfterSerialization', function () {
    it('should get client user agent after serialization', function (done) {
      var wia = new Wia(testUtils.getUserSecretKey());

      wia.getClientUserAgent(function(userAgent) {
        expect(userAgent).to.exist;

        wia.getClientUserAgent(function(userAgent) {
          expect(userAgent).to.exist;
          done();
        });
      });
    });
  });

  describe('#createAppKeyWiaInstance', function () {
    it('should create an instance of wia using app key', function (done) {
      var wia = new Wia({
        appKey: "wia-test-app-key"
      });

      var headers = wia.getHeaders();
      expect(headers).to.exist;
      expect(headers['x-org-app-key']).to.exist;
      done();
    });
  });

  after(function (done) {
      done();
  });
});
