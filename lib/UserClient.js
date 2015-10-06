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

var MQTT_CLIENT_ENDPOINT_PROTOCOL = 'mqtt';
var MQTT_CLIENT_ENDPOINT_HOST = 'api.wia.io';
var MQTT_CLIENT_ENDPOINT_PORT = '1883';
var MQTT_CLIENT_RECONNECT_PERIOD = 1500;
var MQTT_CLIENT_QOS = 0;
var MQTT_CLIENT_RETAIN = false;

var UserClient = function(token, opt) {
  if (!token) throw new Error("No token specified.");
  if (!opt) opt = {};

  this.token = token;
  this.options = {
    stream: opt.stream != null ? opt.stream : CLIENT_DEFAULT_OPTIONS.stream,
    secure: opt.secure != null ? opt.secure : CLIENT_DEFAULT_OPTIONS.secure,
    mqttHost: opt.mqttHost != null ? opt.mqttHost : MQTT_CLIENT_ENDPOINT_HOST,
    mqttPort: opt.mqttPort != null ? opt.mqttPort : MQTT_CLIENT_ENDPOINT_PORT,
    mqttProtocol: opt.mqttProtocol != null ? opt.mqttProtocol : MQTT_CLIENT_ENDPOINT_PROTOCOL
  };

  this.subscribeCallbacks = {};

  if (this.options.secure)
    this.restProtocol = "https://";
  else
    this.restProtocol = "http://";

  var self = this;

  this.initStreamClient = function() {
    this.mqttClient = mqtt.connect(self.options.mqttProtocol + "://" + self.options.mqttHost + ":" + self.options.mqttPort, {
        username: token,
        password: " ",
        reconnectPeriod: MQTT_CLIENT_RECONNECT_PERIOD,
        rejectUnauthorized : false
    });

    this.mqttClient.on('connect', function () {
        console.log("Connected to stream.");
        self.emit('connect');
    });

    this.mqttClient.on('reconnect', function () {
        console.log('reconnect');
        self.emit('reconnect');
    });

    this.mqttClient.on('close', function () {
        console.log('close');
        self.emit('close');
    });

    this.mqttClient.on('offline', function () {
        console.log('offline');
        self.emit('offline');
    });

    this.mqttClient.on('error', function (error) {
        console.log("Error");
        console.log(error);
        self.emit('error', error);
    });

    this.mqttClient.on('message', function (topic, message) {
      console.log(topic);
        try {
          var strMsg = message.toString();
          var topicSplit = topic.match("devices/(.*)/(.*)");
          var msgObj = JSON.parse(strMsg);
          if (self.subscribeCallbacks[topic] && typeof self.subscribeCallbacks[topic] === "function") {
            self.subscribeCallbacks[topic](topicSplit[1], msgObj);
          }
        } catch(e) {
          console.log(e);
        }
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

  this.listDeviceEvents = function(deviceKey, opt, cb) {
    var params = {
      limit: opt.limit || 20,
      page: opt.page || 0
    }

    if (opt.name) {
      params.name = opt.name;
    }

    request.get(this.restProtocol + REST_CLIENT_ENDPOINT + "/devices/" + deviceKey + "/events/" + name, {
      auth: {
        bearer: token
      },
      qs: params,
      json: true
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        if (cb)
          cb(null, body);
      } else {
        if (cb)
          cb(error, null);
      }
    });
  }

  this.listEvents = function(opt, cb) {
    var params = {
      limit: opt.limit || 20,
      page: opt.page || 0
    }

    if (opt.fromTimestamp) {
      params.fromTimestamp = opt.fromTimestamp;
    }

    if (opt.toTimestamp) {
      params.toTimestamp = opt.toTimestamp;
    }

    request.get(this.restProtocol + REST_CLIENT_ENDPOINT + "/events", {
      auth: {
        bearer: token
      },
      qs: params,
      json: true
    }, function (error, response, body) {
      console.log(error);
      console.log(body);
      if (!error && response.statusCode == 200) {
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
        self.subscribeCallbacks["devices/" + deviceKey + "/events"] = cb;
      });
    } else {
      this.mqttClient.subscribe("devices/" + deviceKey + "/events");
      this.subscribeCallbacks["devices/" + deviceKey + "/events"] = cb;
    }
  }

  this.unsubscribeFromDeviceEvents = function(deviceKey) {
    if (this.mqttClient) {
      this.mqttClient.unsubscribe("devices/" + deviceKey + "/events");
    }
    delete this.subscribeCallbacks["devices/" + deviceKey + "/events"];
  }
};

util.inherits(UserClient, EventEmitter);

module.exports = UserClient;
