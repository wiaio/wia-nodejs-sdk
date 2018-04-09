'use strict';

var expect = require('chai').expect;
var testUtils = require('./testUtils');
var request = require('request');
var wia = require('../wia')({
  accessToken: testUtils.getDeviceSecretKey(),
  stream: testUtils.getStreamConfig()
});

describe('Commands', function () {
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

  describe('#subscribeToACommand', function () {
    it('should subscribe to a command', function (done) {
      var isDone = false;

      wia.stream.disconnect();

      wia.stream.on("connect", function() {
        console.log("Connected to stream.");
      });

      wia.commands.subscribe({
        slug: 'say-hello'
      }, function(err, data) {
        console.log("In say hello callback");
        if (!isDone) {
          isDone = true;
          done();
        }
      });

      wia.stream.connect();

      setTimeout(function() {
        request.post({
          url: 'https://api.wia.io/v1/commands/run',
          auth: {
            bearer: testUtils.getUserAccessToken()
          },
          body: {
            slug: 'say-hello',
            device: {
              id: testUtils.getDeviceId()
            }
          },
          json: true
        });
      }, 1000);
    });
  });

  after(function (done) {
    done();
  });
});
