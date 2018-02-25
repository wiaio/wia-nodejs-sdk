'use strict';

var expect = require('chai').expect;
var testUtils = require('./testUtils');
var wia = require('../wia')({
  accessToken: testUtils.getDeviceSecretKey(),
  stream: testUtils.getStreamConfig()
});

describe('Stream', function () {
  before(function (done) {
    done();
  });

  beforeEach(function(done) {
    wia.stream.disconnect();
    setTimeout(function() {
      done();
    }, 150);
  });

  describe('#connectToStream', function () {
    it('should connect to the stream', function (done) {
      var doneCalled = false;
      wia.stream.on("connect", function() {
        if (!doneCalled) {
          doneCalled = true;
          done();
        }
      });
      wia.stream.connect();
    });
  });

  describe('#connectAndDisconnectToStream', function () {
    it('should connect and disconnect to the stream', function (done) {
      var disconnectCalled = false;

      wia.stream.on("connect", function() {
        if (!disconnectCalled) {
          disconnectCalled = true;
          wia.stream.disconnect();
        }
      });

      wia.stream.on("disconnect", function() {
        done();
      });

      wia.stream.connect();
    });
  });

  after(function (done) {
      done();
  });
});
