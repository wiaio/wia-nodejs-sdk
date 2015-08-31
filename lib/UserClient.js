'use strict';

var mqtt = require('mqtt');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var request = require('request');

var CLIENT_DEFAULT_OPTIONS = {
  stream: true,
  secure: true
}

var REST_CLIENT_ENDPOINT = 'api.wia.io/v1';

var MQTT_CLIENT_ENDPOINT = 'mqtt://mqtt.wia.io:1883';
var MQTT_CLIENT_RECONNECT_PERIOD = 1500;
var MQTT_CLIENT_QOS = 0;
var MQTT_CLIENT_RETAIN = false;

var UserClient = function(token, opt) {
  if (!token) throw new Error("No token specified.");
  if (!opt) opt = {};

  this.token = token;
  this.options = {
    stream: opt.stream != null ? opt.stream : CLIENT_DEFAULT_OPTIONS.stream,
    secure: opt.secure != null ? opt.secure : CLIENT_DEFAULT_OPTIONS.secure
  };

  if (this.options.secure)
    this.restProtocol = "https://";
  else
    this.restProtocol = "http://";

  var self = this;

  this.initStreamClient = function() {
    this.mqttClient = mqtt.connect(MQTT_CLIENT_ENDPOINT, {
        username: token,
        password: " ",
        reconnectPeriod: MQTT_CLIENT_RECONNECT_PERIOD
    });

    this.mqttClient.on('connect', function () {
        console.log("Connected to stream.");
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
        console.log("Error");
        console.log(error);
        self.emit('error', error);
    });

    this.mqttClient.on('message', function (topic, message) {
        console.log("Got message");
        console.log(topic);
        console.log(message);
        self.emit('message', topic, message);
    });
  }

  // Callback
  // function cb(devices)
  this.listDevices = function(opt, cb) {
    var params = {
      limit: opt.limit || 20,
      page: opt.page || 0,
      order: opt.order || "name",
      sort: opt.sort || "asc"
    }

    request.get(this.restProtocol + REST_CLIENT_ENDPOINT + "/devices", {
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
    request.get(this.restProtocol + REST_CLIENT_ENDPOINT + "/devices/" + deviceKey, {
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

    request.get(this.restProtocol + REST_CLIENT_ENDPOINT + "/devices/" + deviceKey + "/events/" + name, {
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

  this.subscribeToDeviceEvents = function(deviceKey, opt, cb) {
    if (!this.mqttClient) {
      this.initStreamClient();
      this.mqttClient.on('connect', function() {
        this.subscribe("devices/" + deviceKey + "/events");
      });
    } else {
      this.mqttClient.subscribe("/devices/" + deviceKey + "/events");
    }
  }

  this.unsubscribeToDeviceEvents = function(deviceKey, opt, cb) {
    if (this.mqttClient) {
      this.mqttClient.unsubscribe("/devices/" + deviceKey + "/events");
    }
  }
};

util.inherits(UserClient, EventEmitter);

module.exports = UserClient;
