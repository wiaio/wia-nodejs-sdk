'use strict';

var expect = require('chai').expect;
var testUtils = require('../testUtils');
var wia = require('../../wia')({
    secretKey: testUtils.getUserSecretKey()
});

describe('Device', function () {
    before(function (done) {
        done();
    });

    describe('#createADevice', function () {
      it('should create a device', function (done) {
        var deviceName = "Device " + new Date().getTime();
        wia.devices.create({
          name: deviceName
        }, function(error, device) {
          expect(error).to.be.a.null;
          expect(device).to.not.be.a.null;
          expect(device.name).to.equal(deviceName);
          expect(device.id).to.not.be.a.null;

          done();
        });
      });
    });

    describe('#retrieveADevice', function () {
      it('should retrieve a device', function (done) {
        var deviceName = "Device " + new Date().getTime();
        wia.devices.create({
          name: deviceName
        }, function(error, createdDevice) {
          expect(error).to.be.a.null;
          expect(createdDevice).to.not.be.a.null;
          expect(createdDevice.name).to.equal(deviceName);
          expect(createdDevice.id).to.not.be.a.null;

          wia.devices.retrieve(createdDevice.id, function(error, retrievedDevice) {
            expect(error).to.be.a.null;
            expect(retrievedDevice).to.not.be.a.null;
            expect(createdDevice.id).to.equal(retrievedDevice.id);

            done();
          });
        });
      });
    });

    describe('#updateADevice', function () {
      it('should update a device', function (done) {
        var deviceName = "Device " + new Date().getTime();
        wia.devices.create({
          name: deviceName
        }, function(error, createdDevice) {
          expect(error).to.be.a.null;
          expect(createdDevice).to.not.be.a.null;

          var newDeviceName = "Device " + new Date().getTime();
          wia.devices.update(createdDevice.id, {
              name: newDeviceName
            }, function(error, updatedDevice) {
              expect(error).to.be.a.null;
              expect(updatedDevice).to.not.be.a.null;
              expect(updatedDevice.name).to.equal(newDeviceName);

              done();
            });
        });
      });
    });

    describe('#deleteADevice', function () {
      it('should delete a device', function (done) {
        var deviceName = "Device " + new Date().getTime();
        wia.devices.create({
          name: deviceName
        }, function(error, device) {
          expect(error).to.be.a.null;
          expect(device).to.not.be.a.null;

          wia.devices.delete(device.id, function(error, deleted) {
              expect(error).to.be.a.null;
              expect(deleted).to.not.be.a.null;
              expect(deleted).to.be.true;

              done();
            });
        });
      });
    });

    describe('#listDevices', function () {
      it('should list devices', function (done) {
        var deviceName = "Device " + new Date().getTime();
        wia.devices.list({
          limit: 20,
          page: 0
        }, function(error, data) {
          expect(error).to.be.a.null;
          expect(data).to.not.be.a.null;
          expect(data.devices).to.not.be.a.null;
          expect(data.devices).to.be.instanceof(Array);
          expect(data.count).to.not.be.a.null;
          expect(data.count).to.be.a('number');
          done();
        });
      });
    });

    after(function (done) {
        done();
    });
});
