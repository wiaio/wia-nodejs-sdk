const { expect } = require('chai');
const randomstring = require('randomstring');
const testUtils = require('./testUtils');
const Wia = require('../wia');

describe('Device', () => {
  before((done) => {
    done();
  });

  describe('#createADevice', () => {
    it('should create a device', async () => {
      try {
        const wia = new Wia(testUtils.getOrganisationSecretKey());
        const createdDevice = await wia.devices.create({
          name: randomstring.generate(16),
          space: {
            id: testUtils.getSpaceId(),
          },
        });

        expect(createdDevice).to.exist;
        expect(createdDevice.id).to.exist;
        expect(createdDevice.name).to.exist;
        expect(createdDevice.space).to.exist;
        expect(createdDevice.space.id).to.exist;
        expect(createdDevice.space.id).to.equal(testUtils.getSpaceId());
      } catch (e) {
        console.log(e);
        expect(e).to.not.exist;
      }
    });
  });

  describe('#updateADevice', () => {
    it('should update a device', async () => {
      try {
        const wia = new Wia(testUtils.getOrganisationSecretKey());
        const oldName = randomstring.generate(16);
        const createdDevice = await wia.devices.create({
          name: oldName,
          space: {
            id: testUtils.getSpaceId(),
          },
        });
        expect(createdDevice).to.exist;
        expect(createdDevice.name).to.equal(oldName);

        const newName = randomstring.generate(16);
        const updatedDevice = await wia.devices.update(
          createdDevice.id,
          {
            name: newName,
          },
        );

        expect(updatedDevice).to.exist;
        expect(updatedDevice.name).to.equal(newName);
      } catch (e) {
        console.log(e);
        expect(e).to.not.exist;
      }
    });
  });

  describe('#updateADeviceState', () => {
    it('should update a device state', async () => {
      try {
        const wia = new Wia(testUtils.getOrganisationSecretKey());
        const oldName = randomstring.generate(16);
        const createdDevice = await wia.devices.create({
          name: oldName,
          space: {
            id: testUtils.getSpaceId(),
          },
        });
        expect(createdDevice).to.exist;
        expect(createdDevice.name).to.equal(oldName);

        const fooValue = 12345;
        const updatedDevice = await wia.devices.update(
          createdDevice.id,
          {
            state: {
              foo: fooValue,
            },
          },
        );

        expect(updatedDevice).to.exist;
        expect(updatedDevice.state).to.exist;
        expect(updatedDevice.state.foo).to.exist;
        expect(updatedDevice.state.foo.value).to.exist;
        expect(updatedDevice.state.foo.value).to.equal(fooValue);
      } catch (e) {
        console.log(e);
        expect(e).to.not.exist;
      }
    });
  });

  describe('#retrieveDeviceListForSpace', () => {
    it('should retrieve a list of devices for a space', async () => {
      try {
        const wia = new Wia(testUtils.getOrganisationSecretKey());
        const result = await wia.devices.list({
          space: {
            id: testUtils.getSpaceId(),
          },
        });

        expect(result).to.exist;

        result.devices.forEach((device) => {
          expect(device.id).to.exist;
          expect(device.name).to.exist;
          expect(device.space).to.exist;
          expect(device.space.id).to.exist;
          expect(device.space.id).to.equal(testUtils.getSpaceId());
        });

        expect(result.count).to.exist;

        console.log(`Retrieved ${result.count} devices for space.`);
      } catch (e) {
        console.log(e);
        expect(e).to.not.exist;
      }
    });
  });

  describe('#retrieveDeviceListBadSpaceId', () => {
    it('should throw an error when trying to get devices for a space that does not exist', async () => {
      try {
        const wia = new Wia(testUtils.getOrganisationSecretKey());
        const result = await wia.devices.list({
          space: {
            id: 'abc123',
          },
        });

        expect(result).to.not.exist;
      } catch (e) {
        console.log(e);
        expect(e).to.exist;
      }
    });
  });

  // describe('#createInstanceOfWiaDeviceSecretKey', () => {
  //   it('should create an instance of wia using a device secret key', (done) => {
  //     const wiaDevice = new Wia(testUtils.getDeviceSecretKey());
  //     wiaDevice.whoami((error, data) => {
  //       expect(error).to.not.exist;
  //       expect(data).to.exist;
  //       done();
  //     });
  //   });
  // });

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

  // describe('#createADeviceNoParameters', () => {
  //   it('should fail to create a device due to no parameters being sent', (done) => {
  //     wia.devices.create(null, (error, device) => {
  //       expect(error).to.exist;
  //       expect(device).to.not.exist;
  //       done();
  //     });
  //   });
  // });

  // describe('#createADeviceInvalidName', () => {
  //   it('should fail to create a device due to invalid name parameter being sent', (done) => {
  //     const deviceObj = {
  //       name: null,
  //     };

  //     wia.devices.create(deviceObj, (error, device) => {
  //       expect(error).to.exist;
  //       expect(device).to.not.exist;
  //       done();
  //     });
  //   });
  // });

  // describe('#retrieveADeviceNoParameters', () => {
  //   it('should fail to retrieve a device due to no parameters being sent', (done) => {
  //     wia.devices.retrieve(null, (error, device) => {
  //       expect(error).to.exist;
  //       expect(device).to.not.exist;
  //       done();
  //     });
  //   });
  // });

  after((done) => {
    done();
  });
});
