'use strict';

var deviceOptions =  {
    token: process.env.DEVICE_TOKEN
};

describe('Device', function () {
    before(function (done) {
        done();
    });

    describe('#createDeviceClientAndConnect', function () {
        it('should create a device client and connect to server', function (done) {
            this.timeout(2500);
            var DeviceClient = require('../lib/DeviceClient');

            var client = new DeviceClient({token: deviceOptions.token});

            client.on("connect", function() {
                console.log("Client connected!");
                done();
            });

            client.on("error", function(error) {
                console.log("Error! - " + error);
                done();
            });
        });
    });

    describe('#connectClientAndSendEvent', function () {
        it('should connect a client and send an event', function (done) {
            this.timeout(2500);
            var DeviceClient = require('../lib/DeviceClient');

            var client = new DeviceClient({token: deviceOptions.token});

            client.on("connect", function() {
                console.log("Client connected!");
                client.publishEvent("Sensor", {
                    temperature: 14.0
                }, function() {
                    console.log("In client callback!");
                    done();
                });
            });

            client.on("error", function(error) {
                console.log("Error! - " + error);
                done();
            });
        });
    });

    after(function (done) {
        done();
    });
});
