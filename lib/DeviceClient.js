'use strict';

var mqtt = require('mqtt');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var MQTT_CLIENT_ENDPOINT = 'mqtt://mqtt.wia.io:1883';
var MQTT_CLIENT_USERNAME = "device";
var MQTT_CLIENT_RECONNECT_PERIOD = 1500;
var MQTT_CLIENT_QOS = 0;
var MQTT_CLIENT_RETAIN = false;

var DeviceClient = function(options) {
    this.options = options || {};

    if (!options.token) throw new Error("No token specified.");

    var self = this;

    this.mqttClient = mqtt.connect(MQTT_CLIENT_ENDPOINT, {
        username: MQTT_CLIENT_USERNAME,
        password: options.token,
        reconnectPeriod: MQTT_CLIENT_RECONNECT_PERIOD
    });

    this.mqttClient.on('connect', function () {
        self.emit('connect');
    });

    this.mqttClient.on('reconnect', function () {
        self.emit('reconnect');
    });

    this.mqttClient.on('close', function () {
        self.emit('close');
    });

    this.mqttClient.on('offline', function () {
        self.emit('offline');
    });

    this.mqttClient.on('error', function (error) {
        self.emit('error', error);
    });

    this.mqttClient.on('message', function (topic, message) {
        self.emit('message', topic, message);
    });

    this.publishEvent = function(eventName, eventData, callback) {
        self.mqttClient.publish('device/event', JSON.stringify({
            name: eventName,
            data: eventData
        }), { qos: MQTT_CLIENT_QOS, retain: MQTT_CLIENT_RETAIN }, function() {
            if (callback)
                callback();
        });
    };
};

util.inherits(DeviceClient, EventEmitter);

// export the class
module.exports = DeviceClient;
