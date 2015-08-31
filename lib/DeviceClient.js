'use strict';

var mqtt = require('mqtt');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var CLIENT_DEFAULT_OPTIONS = {
  stream: true,
  secure: true
}

var REST_CLIENT_HOST = 'api.wia.io';

var MQTT_CLIENT_ENDPOINT = 'mqtt://mqtt.wia.io:1883';
var MQTT_CLIENT_RECONNECT_PERIOD = 1500;
var MQTT_CLIENT_QOS = 0;
var MQTT_CLIENT_RETAIN = false;

var DeviceClient = function(token, options) {
  if (!token) throw new Error("No token specified.");

  this.token = token;
  this.options = options || {};

  var self = this;

  this.mqttClient = mqtt.connect(MQTT_CLIENT_ENDPOINT, {
      username: options.token,
      password: "_",
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

module.exports = DeviceClient;
