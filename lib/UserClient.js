'use strict';

var mqtt = require('mqtt');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var request = require('request');

var CLIENT_DEFAULT_OPTIONS = {
  stream: true,
  secure: true
}

var REST_CLIENT_HOST = 'api.wia.io/v1';

var MQTT_CLIENT_ENDPOINT = 'mqtt://mqtt.wia.io:1883';
var MQTT_CLIENT_RECONNECT_PERIOD = 1500;
var MQTT_CLIENT_QOS = 0;
var MQTT_CLIENT_RETAIN = false;

var UserClient = function(token, opt) {
  if (!token) throw new Error("No token specified.");

  if (!opt) opt = {};

  this.token = token;
  this.options = {
    stream: opt.stream || CLIENT_DEFAULT_OPTIONS.stream,
    secure: opt.secure || CLIENT_DEFAULT_OPTIONS.secure
  };

  if (this.options.secure)
    this.restProtocol = "https://";
  else
    this.restProtocol = "http://";

  var self = this;

  /*this.mqttClient = mqtt.connect(MQTT_CLIENT_ENDPOINT, {
      username: token,
      password: " ",
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
  });*/

  // Callback
  // function cb(devices)
  this.listDevices = function(opt, cb) {
    var params = {
      limit: opt.limit || 20,
      page: opt.page || 0,
      order: opt.order || "name",
      sort: opt.sort || "asc"
    }

    request.get(this.restProtocol + REST_CLIENT_HOST + "/devices", {
      auth: {
        bearer: token
      },
      qs: params,
      json: true
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(response);
        if (cb)
          cb(null, body.devices);
      } else {
        if (cb)
          cb(error, null);
      }
    });
  }

  this.getDevice = function(deviceKey, cb) {
    request.get(this.restProtocol + REST_CLIENT_HOST + "/devices/" + deviceKey, {
      auth: {
        bearer: token
      },
      json: true
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(response);
        if (cb)
          cb(null, body);
      } else {
        if (cb)
          cb(error, null);
      }
    });
  }

  this.listDeviceEvents = function(deviceKey, name, opt, cb) {
    if (name !== "Sensor" && name !== "Location") {
      if (cb)
        return cb("Name must be Sensor or Location.", null);
      return null;
    }

    var params = {
      limit: opt.limit || 20,
      page: opt.page || 0,
      order: opt.order || "name",
      sort: opt.sort || "asc"
    }

    request.get(this.restProtocol + REST_CLIENT_HOST + "/devices/" + deviceKey + "/events/" + name, {
      auth: {
        bearer: token
      },
      qs: params,
      json: true
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(response);
        if (cb)
          cb(null, body);
      } else {
        if (cb)
          cb(error, null);
      }
    });
  }
};

util.inherits(UserClient, EventEmitter);

module.exports = UserClient;
