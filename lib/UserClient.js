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
    console.log("Connecting to " + self.options.mqttProtocol + "://" + self.options.mqttHost + ":" + self.options.mqttPort);
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
        console.log("error");
        console.log(error);
        self.emit('error', error);
    });

    this.mqttClient.on('message', function (topic, message) {
      try {
        var strMsg = message.toString();
        var topicSplit = topic.match("devices/(.*?)/(.*)");
        var deviceKey = topicSplit[1];
        var topicAction = topicSplit[2];

        var msgObj = JSON.parse(strMsg);
        if (self.subscribeCallbacks[topic] && typeof self.subscribeCallbacks[topic] === "function") {
          self.subscribeCallbacks[topic](deviceKey, msgObj);
        }

        if (topicAction.indexOf("events") == 0 &&
              typeof self.subscribeCallbacks["devices/" + deviceKey + "/events/+"] === "function") {
          self.subscribeCallbacks["devices/" + deviceKey + "/events/+"](deviceKey, msgObj);
        }
      } catch(e) {
        console.log(e);
      }
      self.emit('message', topic, message);
    });
  }

  this.createDevice = function(data, cb) {
    request.post(this.restProtocol + REST_CLIENT_ENDPOINT + "/devices", {
      body: data,
      auth: {
        bearer: token
      },
      headers: {
        'Content-Type': 'application/json'
      },
      json: true
    }, function (error, response, body) {
      if (cb) {
        if (error) return cb(error, null);

        if (response.statusCode == 200 || response.statusCode == 201)
          cb(null, body ? body : {});
        else
          cb(new WiaRequestException(response.statusCode, body), null);
      }
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
      if (cb) {
        if (error) return cb(error, null);

        if (response.statusCode == 200)
          cb(null, body);
        else
          cb(new WiaRequestException(response.statusCode, body), null);
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
      if (cb) {
        if (error) return cb(error, null);

        if (response.statusCode == 200)
          cb(null, body ? body : []);
        else
          cb(new WiaRequestException(response.statusCode, body), null);
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

    request.get(this.restProtocol + REST_CLIENT_ENDPOINT + "/devices/" + deviceKey + "/events", {
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
      if (!error && response.statusCode == 200) {
        if (cb)
          cb(null, body);
      } else {
        if (cb)
          cb(error, null);
      }
    });
  }

  this.subscribeToDeviceEvent = function(deviceKey, eventName, cb) {
    if (!self.mqttClient) {
      self.initStreamClient();
      self.mqttClient.on('connect', function() {
        self.subscribeCallbacks["devices/" + deviceKey + "/events/" + eventName] = cb;
        self.mqttClient.subscribe("devices/" + deviceKey + "/events/" + eventName);
      });
    } else {
      self.subscribeCallbacks["devices/" + deviceKey + "/events/" + eventName] = cb;
      self.mqttClient.subscribe("devices/" + deviceKey + "/events/" + eventName);
    }
  }

  this.unsubscribeFromDeviceEvent = function(deviceKey, eventName, cb) {
    if (this.mqttClient) {
      this.mqttClient.unsubscribe("devices/" + deviceKey + "/events/" + eventName);
    }
    delete this.subscribeCallbacks["devices/" + deviceKey + "/events/" + eventName];
    if (cb)
      cb();
  }

  this.subscribeToAllDeviceEvents = function(deviceKey, cb) {
    if (!self.mqttClient) {
      self.initStreamClient();
      self.mqttClient.on('connect', function() {
        self.subscribeCallbacks["devices/" + deviceKey + "/events/+"] = cb;
        self.mqttClient.subscribe("devices/" + deviceKey + "/events/+");
      });
    } else {
      self.subscribeCallbacks["devices/" + deviceKey + "/events/+"] = cb;
      self.mqttClient.subscribe("devices/" + deviceKey + "/events/+");
    }
  }

  this.unsubscribeFromAllDeviceEvents = function(deviceKey, cb) {
    if (this.mqttClient) {
      this.mqttClient.unsubscribe("devices/" + deviceKey + "/events/+");
    }
    delete this.subscribeCallbacks["devices/" + deviceKey + "/events"];
    if (cb)
      cb();
  }

  this.runCommand = function(deviceKey, commandName, commandData, cb) {
    if (!this.mqttClient) {
      this.initStreamClient();
      this.mqttClient.on('connect', function() {
        self.mqttClient.publish('devices/' + deviceKey + '/commands/' + commandName, JSON.stringify(commandData),
            { qos: MQTT_CLIENT_QOS, retain: MQTT_CLIENT_RETAIN }, function() {
              if (cb)
                cb();
            });
      });
    } else {
      this.mqttClient.publish('devices/' + deviceKey + '/commands/' + commandName, JSON.stringify(commandData),
          { qos: MQTT_CLIENT_QOS, retain: MQTT_CLIENT_RETAIN }, function() {
            if (cb)
              cb();
          });
    }
  }

  this.getMe = function(cb) {
    request.get(this.restProtocol + REST_CLIENT_ENDPOINT + "/users/me", {
      auth: {
        bearer: token
      },
      json: true
    }, function (error, response, body) {
      if (cb) {
        if (error) return cb(error, null);

        if (response.statusCode == 200)
          cb(null, body ? body : {});
        else
          cb(new WiaRequestException(response.statusCode, body), null);
      }
    });
  };
};

function WiaRequestException(statusCode, message) {
   this.statusCode = statusCode;
   this.message = message;
   this.toString = function() {
      return this.statusCode + " : " + this.message;
   };
}

util.inherits(UserClient, EventEmitter);

module.exports = UserClient;
