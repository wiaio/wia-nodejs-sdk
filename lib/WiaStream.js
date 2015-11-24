'use strict';

var MQTT_CLIENT_RECONNECT_PERIOD = 1500;
var MQTT_CLIENT_QOS = 0;
var MQTT_CLIENT_RETAIN = false;

var mqtt = require('mqtt');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

function WiaStream(wia) {
  var self = this;
  self.connected  = false;

  this.subscribeCallbacks = {};

  this.connect = function() {
    self.mqttClient = mqtt.connect(wia.getApiField('mqttProtocol') + "://" + wia.getApiField('mqttHost') + ":" + wia.getApiField('mqttPort'), {
        username: wia.getApiField('accessToken'),
        password: " ",
        reconnectPeriod: MQTT_CLIENT_RECONNECT_PERIOD
    });

    self.mqttClient.on('connect', function () {
        self.connected = true;
        self.emit('connect');
    });

    self.mqttClient.on('reconnect', function () {
        console.log('reconnect');
        self.emit('reconnect');
    });

    self.mqttClient.on('close', function () {
        console.log('close: ' + wia.getApiField('accessToken'));
        self.connected = false;
        self.emit('close');
    });

    self.mqttClient.on('offline', function () {
        console.log('offline');
        self.connected = false;
        self.emit('offline');
    });

    self.mqttClient.on('error', function (error) {
        console.log('error: ' + error);
    });

    self.mqttClient.on('message', function (topic, message) {
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
          } else if (topicAction.indexOf("logs") == 0 &&
                typeof self.subscribeCallbacks["devices/" + deviceKey + "/logs/+"] === "function") {
            self.subscribeCallbacks["devices/" + deviceKey + "/logs/+"](deviceKey, msgObj);
          }
        } catch(e) {
          console.log(e);
        }
        self.emit('message', topic, message);
    });
  },
  this.publish = function(topic, data, cb) {
    self.mqttClient.publish(topic, data,
        { qos: MQTT_CLIENT_QOS, retain: MQTT_CLIENT_RETAIN }, function() {
        if (cb)
            cb();
    });
  },
  this.subscribe = function(topic, cb) {
    console.log("Subscribing to: " + topic);
    self.subscribeCallbacks[topic] = cb;
    self.mqttClient.subscribe(topic);
  },
  this.unsubscribe = function(topic, cb) {
    delete self.subscribeCallbacks[topic];
    self.mqttClient.unsubscribe(topic);
  }
}

util.inherits(WiaStream, EventEmitter);

module.exports = WiaStream;