'use strict';

var mqtt = require('mqtt');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var request = require('request');
var os = require('os');
var net = require('net');

var CLIENT_DEFAULT_OPTIONS = {
  stream: true,
  secure: true,
  sendSystemStats: true
}

var REST_CLIENT_ENDPOINT = 'api.wia.io/v1';

var MQTT_CLIENT_ENDPOINT_HOST = 'api.wia.io';
var MQTT_CLIENT_ENDPOINT_PORT = '1883';
var MQTT_CLIENT_RECONNECT_PERIOD = 1500;
var MQTT_CLIENT_QOS = 0;
var MQTT_CLIENT_RETAIN = false;

var DeviceClient = function(token, opt) {
  if (!token) throw new Error("No token specified.");
  if (!opt) opt = {};

  this.deviceKey = null;
  this.token = token;
  this.options = {
    stream: opt.stream != null ? opt.stream : CLIENT_DEFAULT_OPTIONS.stream,
    secure: opt.secure != null ? opt.secure : CLIENT_DEFAULT_OPTIONS.secure,
    mqttHost: opt.mqttHost != null ? opt.mqttHost : MQTT_CLIENT_ENDPOINT_HOST,
    mqttPort: opt.mqttPort != null ? opt.mqttPort : MQTT_CLIENT_ENDPOINT_PORT
  };

  if (this.options.secure)
    this.restProtocol = "https://";
  else
    this.restProtocol = "http://";

  var self = this;

  self.commandCallbacks = {};

  if (this.options.stream) {
    request.get(this.restProtocol + REST_CLIENT_ENDPOINT + "/devices/me", {
      auth: {
        bearer: token
      },
      json: true
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        self.deviceInfo = body;

        self.mqttClient = mqtt.connect("mqtt://" + self.options.mqttHost + ":" + self.options.mqttPort, {
            username: token,
            password: " ",
            reconnectPeriod: MQTT_CLIENT_RECONNECT_PERIOD
        });

        self.mqttClient.on('connect', function () {
          if (self.commandCallbacks) {
            for (var key in self.commandCallbacks) {
              if (self.commandCallbacks.hasOwnProperty(key)) {
                console.log("Subscribing to: devices/" + self.deviceInfo.deviceKey + "/commands/" + key);
                self.mqttClient.subscribe("devices/" + self.deviceInfo.deviceKey + "/commands/" + key, {
                  qos: MQTT_CLIENT_QOS
                }, function(err, granted) {
                  console.log(err);
                  console.log(granted);
                });
              }
            }
          }
          self.emit('connect');
      });

        self.mqttClient.on('reconnect', function () {
            self.emit('reconnect');
        });

        self.mqttClient.on('close', function () {
            self.emit('close');
        });

        self.mqttClient.on('offline', function () {
            self.emit('offline');
        });

        self.mqttClient.on('error', function (error) {
            self.emit('error', error);
        });

        self.mqttClient.on('message', function (topic, message) {
            var topicCommand = topic.match("devices/" + self.deviceInfo.deviceKey + "/commands/(.*)");

            if (topicCommand) {
              if (self.commandCallbacks[topicCommand[1]]) {
                var dataObj = {};
                if (message) {
                  dataObj = JSON.parse(message.toString());
                }
                self.commandCallbacks[topicCommand[1]](dataObj);
              }
            }
            self.emit('message', topic, message);
        });
      } else {
        console.log("Error getting device details.");
      }
    });
  }

  this.publishEvent = function(eventName, eventData, cb) {
    var publishData = {
        name: eventName,
        data: eventData
    };

    if (eventData && eventData.timestamp && new Date(eventData.timestamp) !== "Invalid Date") {
      publishData.timestamp = eventData.timestamp;
      delete eventData.timestamp;
    }

    if (this.options.stream && self.mqttClient) {
      self.mqttClient.publish('device/event', JSON.stringify(publishData),
          { qos: MQTT_CLIENT_QOS, retain: MQTT_CLIENT_RETAIN }, function() {
          if (cb)
              cb();
      });
    } else {
      request.post(this.restProtocol + REST_CLIENT_ENDPOINT + "/events", {
        body: publishData,
        auth: {
          bearer: token
        },
        json: true
      }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          if (cb)
            cb(null);
        } else {
          if (cb) {
            if (error)
              cb(error);
            else {
              cb(response.statusCode);
            }
          }
        }
      });
    }
  };

  this.getMe = function(cb) {
    request.get(this.restProtocol + REST_CLIENT_ENDPOINT + "/devices/me", {
      auth: {
        bearer: token
      },
      json: true
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        if (cb)
          cb(null, body);
      } else {
        if (cb) {
          if (error)
            cb(error);
          else
            cb(response.statusCode);
        }
      }
    });
  };

  this.sendPing = function(cb) {
    request.get(this.restProtocol + REST_CLIENT_ENDPOINT + "/ping", {
      auth: {
        bearer: token
      },
      json: true
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        if (cb)
          cb(null);
      } else {
        if (cb)
          cb(error);
      }
    });
  };

  this.sendSystemStats = function(cb) {
    console.log(os.hostname());
    console.log(os.type());
    console.log(os.platform());
    console.log(os.arch());
    console.log(os.totalmem());
    console.log(os.freemem());
    console.log(os.cpus());
    console.log(os.networkInterfaces());
  }

  this.printSystemStats = function(cb) {
    console.log(os.hostname());
    console.log(os.type());
    console.log(os.platform());
    console.log(os.arch());
    console.log(os.totalmem());
    console.log(os.freemem());
    console.log(os.cpus());
    console.log(os.networkInterfaces());
  }

  this.registerCommand = function(commandName, commandFunction, cb) {
    if (self.mqttClient) {
      self.mqttClient.subscribe("devices/" + self.deviceInfo.deviceKey + "/commands/" + commandName);
    }
    self.commandCallbacks[commandName] = commandFunction;
    if (cb)
      cb();
  }

  this.deregisterCommand = function(commandName, cb) {
    delete self.commandCallbacks[commandName];
    if (cb)
      cb();
  }

  this.deregisterAllCommands = function(cb) {
    if (self.mqttClient) {
      self.mqttClient.unsubscribe("devices/" + self.deviceInfo.deviceKey + "/commands/+");
    }
    self.commandCallbacks = {};
  }
};

util.inherits(DeviceClient, EventEmitter);

module.exports = DeviceClient;
