'use strict';

var expect = require('chai').expect;
var testUtils = require('./testUtils');
var Wia = require('../wia');
var wia = require('../wia')({
  secretKey: testUtils.getDeviceSecretKey()
});

describe('Device', function () {
  before(function (done) {
      done();
  });

  describe('#createInstanceOfWiaDeviceSecretKey', function () {
    it('should create an instance of wia using a device secret key', function (done) {
      var wiaDevice = new Wia(testUtils.getDeviceSecretKey());
      wiaDevice.whoami(function(error, data) {
        expect(error).to.not.exist;
        expect(data).to.exist;
        done();
      });
    });
  });

  // describe('#createInstanceOfWiaBadDeviceSecretKey', function () {
  //   it('should create an instance of wia using only a bad device secret key', function (done) {
  //     var wiaDevice = new Wia("abcdef");
  //     wiaDevice.whoami(function(error, data) {
  //       expect(error).to.exist;
  //       done();
  //     });
  //   });
  // });

  // describe('#createInstanceOfWiaInvalidRestHost', function () {
  //   it('should create an instance of wia using an invalid rest host', function (done) {
  //     var wiaDevice = new Wia({
  //       rest: {
  //         protocol: "https",
  //         host: "doesnotexist.wihya.io",
  //         port: "443",
  //         basePath: "/v1/"
  //       },
  //       secretKey: testUtils.getDeviceSecretKey()
  //     });
  //
  //     wiaDevice.whoami(function(error, data) {
  //       expect(error).to.exist;
  //       expect(data).to.not.exist;
  //       done();
  //     });
  //   });
  // });

  // describe('#createADevice', function () {
  //   it('should create a device', function (done) {
  //     var deviceName = "Device " + new Date().getTime();
  //     wia.devices.create({
  //       name: deviceName
  //     }, function(error, device) {
  //       expect(error).to.not.exist;
  //       expect(device).to.exist;
  //       done();
  //     });
  //   });
  // });
  //
  // describe('#retrieveADevice', function () {
  //   it('should retrieve a device', function (done) {
  //     var deviceName = "Device " + new Date().getTime();
  //     wia.devices.create({
  //       name: deviceName
  //     }, function(error, createdDevice) {
  //       expect(error).to.not.exist;
  //       expect(createdDevice).to.exist;
  //
  //       wia.devices.retrieve(createdDevice.id, function(error, retrievedDevice) {
  //         expect(error).to.not.exist;
  //         expect(retrievedDevice).to.exist;
  //         expect(createdDevice.id).to.equal(retrievedDevice.id);
  //         done();
  //       });
  //     });
  //   });
  // });
  //
  // describe('#updateADevice', function () {
  //   it('should update a device', function (done) {
  //     var deviceName = "Device " + new Date().getTime();
  //     wia.devices.create({
  //       name: deviceName
  //     }, function(error, createdDevice) {
  //       expect(error).to.not.exist;
  //       expect(createdDevice).to.exist;
  //
  //       var newDeviceName = "Device " + new Date().getTime();
  //       wia.devices.update(createdDevice.id, {
  //           name: newDeviceName
  //         }, function(error, updatedDevice) {
  //           expect(error).to.not.exist;
  //           expect(updatedDevice).to.exist;
  //           expect(updatedDevice.name).to.equal(newDeviceName);
  //
  //           done();
  //         });
  //     });
  //   });
  // });
  //
  // describe('#deleteADevice', function () {
  //   it('should delete a device', function (done) {
  //     var deviceName = "Device " + new Date().getTime();
  //     wia.devices.create({
  //       name: deviceName
  //     }, function(error, device) {
  //       expect(error).to.not.exist;
  //       expect(device).to.exist;
  //
  //       wia.devices.delete(device.id, function(error, deleted) {
  //         expect(error).to.not.exist;
  //         expect(deleted).to.exist;
  //
  //         done();
  //       });
  //     });
  //   });
  // });
  //
  // describe('#listDevices', function () {
  //   it('should list devices', function (done) {
  //     var deviceName = "Device " + new Date().getTime();
  //     wia.devices.list({
  //       limit: 20,
  //       page: 0
  //     }, function(error, data) {
  //       expect(error).to.not.exist;
  //       expect(data).to.exist;
  //       expect(data.devices).to.exist;
  //       expect(data.devices).to.be.instanceof(Array);
  //       expect(data.count).to.exist;
  //       expect(data.count).to.be.a('number');
  //       done();
  //     });
  //   });
  // });

  describe('#createADeviceNoParameters', function () {
    it('should fail to create a device due to no parameters being sent', function (done) {
      wia.devices.create(null, function(error, device) {
        expect(error).to.exist;
        expect(device).to.not.exist;
        done();
      });
    });
  });

  describe('#createADeviceInvalidName', function () {
    it('should fail to create a device due to invalid name parameter being sent', function (done) {
      var deviceObj = {
        name: null
      };

      wia.devices.create(deviceObj, function(error, device) {
        expect(error).to.exist;
        expect(device).to.not.exist;
        done();
      });
    });
  });

  describe('#retrieveADeviceNoParameters', function () {
    it('should fail to retrieve a device due to no parameters being sent', function (done) {
      wia.devices.retrieve(null, function(error, device) {
        expect(error).to.exist;
        expect(device).to.not.exist;
        done();
      });
    });
  });

  after(function (done) {
      done();
  });
});
