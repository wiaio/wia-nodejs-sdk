'use strict';

const expect = require('chai').expect;
const testUtils = require('./testUtils');
const fs = require('fs');
const Wia = require('../wia');
const wia = new Wia({
  secretKey: testUtils.getDeviceSecretKey()
})

describe('Wia', function () {
  before(function (done) {
      done();
  });

  describe('#publishAnEvent', function () {
    it('should publish an event', function (done) {
      wia.events.publish({
        name: 'temperature',
        data: 21.4564
      }, function(err, result) {
        if (err) {
          console.log(err);
          return;
        }

        expect(result).to.exist;
        expect(result.id).to.exist;
        done();
      });
    });
  });

  describe('#publishAnEventWithFile', function () {
    it('should publish an event with a file', function (done) {
      wia.events.publish({
        name: 'photo',
        file: fs.createReadStream(__dirname + '/balfie.png')
      }, function(err, result) {
        if (err) {
          console.log(err);
          return;
        }

        expect(result).to.exist;
        expect(result.id).to.exist;
        done();
      });
    });
  });

  describe('#publishALocation', function () {
    it('should publish a location', function (done) {
      wia.locations.publish({
        latitude: 35.652832,
        longitude: 139.839478
      }, function(err, result) {
        if (err) {
          console.log(err);
          return;
        }

        expect(result).to.exist;
        expect(result.id).to.exist;
        done();
      });
    });
  });

  after(function (done) {
      done();
  });
});
