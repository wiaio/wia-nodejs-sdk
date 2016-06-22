'use strict';

var expect = require('chai').expect;
var testUtils = require('../testUtils');
var wia = require('../../wia')({
    secretKey: testUtils.getUserSecretKey(),
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
          console.log("Stream got connected!");
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
          console.log("Stream got connected!");
          if (!disconnectCalled) {
            console.log("Calling disconnect.");
            disconnectCalled = true;
            wia.stream.disconnect();
          }
        });

        wia.stream.on("disconnect", function() {
          console.log("Stream got disconnected!");
          done();
        });

        wia.stream.connect();
      });
    });

    after(function (done) {
        done();
    });
});
