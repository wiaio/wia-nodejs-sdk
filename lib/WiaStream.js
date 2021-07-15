// const MQTT_CLIENT_RECONNECT_PERIOD = 1500;
// const MQTT_CLIENT_QOS = 0;
// const MQTT_CLIENT_RETAIN = false;

// const mqtt = require('mqtt');
// const util = require('util');
// const { EventEmitter } = require('events');
// const { exec } = require('child_process');

// class WiaStream(wia) {
//   self.connected = false;

//   this.subscribeCallbacks = {};

//   this.connect = function () {
//     self.mqttClient = mqtt.connect(`${wia.getApiField('stream', 'protocol')}://${wia.getApiField('stream', 'host')}:${wia.getApiField('stream', 'port')}`, {
//       username: wia.getApiField('accessToken') || wia.getApiField('appKey'),
//       password: ' ',
//       reconnectPeriod: MQTT_CLIENT_RECONNECT_PERIOD,
//     });

//     self.mqttClient.on('connect', () => {
//       self.connected = true;
//       self.mqttClient.unsubscribe('#');

//       for (const topic in self.subscribeCallbacks) {
//         if (self.subscribeCallbacks.hasOwnProperty(topic)) {
//           self.mqttClient.subscribe(topic);
//         }
//       }

//       self.emit('connect');
//     });

//     self.mqttClient.on('reconnect', () => {
//       self.emit('reconnect');
//     });

//     self.mqttClient.on('close', () => {
//       self.connected = false;
//       self.emit('disconnect');
//     });

//     self.mqttClient.on('offline', () => {
//       self.connected = false;
//       self.emit('offline');
//     });

//     self.mqttClient.on('error', (error) => {
//       console.log(`error: ${error}`);
//       self.emit('error');
//     });

//     self.mqttClient.on('message', (topic, message) => {
//       try {
//         if (topic.indexOf('devices') === 0) {
//           const topicSplit = topic.match('devices/(.*?)/(.*)');
//           if (topicSplit) {
//             const deviceId = topicSplit[1];
//             const topicAction = topicSplit[2];
//             const strMsg = message.toString();

//             let msgObj = null;
//             if (strMsg && strMsg.length > 0) {
//               msgObj = JSON.parse(strMsg);
//             } else {
//               msgObj = {};
//             }

//             if (topicAction.indexOf('/') >= 0) {
//               const topicActionSplit = topicAction.match('(.*?)/(.*)');
//               msgObj.type = topicActionSplit[1];
//             } else {
//               msgObj.type = topicAction;
//             }

//             if (self.subscribeCallbacks[`devices/${deviceId}/#`]
//  && typeof self.subscribeCallbacks[`devices/${deviceId}/#`] === 'function') {
//               self.subscribeCallbacks[`devices/${deviceId}/#`](msgObj);
//             }

//             if (self.subscribeCallbacks[topic]
//  && typeof self.subscribeCallbacks[topic] === 'function') {
//               self.subscribeCallbacks[topic](msgObj);
//             }

//             if (topicAction.indexOf('events') == 0
//        && typeof self.subscribeCallbacks[`devices/${deviceId}/events/+`] === 'function') {
//               self.subscribeCallbacks[`devices/${deviceId}/events/+`](msgObj);
//             } else if (topicAction.indexOf('logs') == 0
//       && typeof self.subscribeCallbacks[`devices/${deviceId}/logs/+`] === 'function') {
//               self.subscribeCallbacks[`devices/${deviceId}/logs/+`](msgObj);
//             } else if (topicAction.indexOf('locations') == 0
//          && typeof self.subscribeCallbacks[`devices/${deviceId}/locations/+`] === 'function') {
//               self.subscribeCallbacks[`devices/${deviceId}/locations/+`](msgObj);
//             }
//           }
//         }
//       } catch (e) {
//         console.log(e);
//       }
//       self.emit('message', topic, message);
//     });
//   },
//   this.disconnect = function (immediately, cb) {
//     if (self.mqttClient) {
//       self.mqttClient.end(immediately || false, cb || null);
//     }
//   },
//   this.publish = function (topic, data, cb) {
//     if (self.mqttClient) {
//       self.mqttClient.publish(topic, data,
//         { qos: MQTT_CLIENT_QOS, retain: MQTT_CLIENT_RETAIN }, () => {
//           if (cb) cb();
//         });
//     }
//   },
//   this.subscribe = function (topic, cb) {
//     self.subscribeCallbacks[topic] = cb;
//     if (self.mqttClient) {
//       self.mqttClient.subscribe(topic);
//     }
//   },
//   this.unsubscribe = function (topic, cb) {
//     delete self.subscribeCallbacks[topic];
//     if (self.mqttClient) {
//       self.mqttClient.unsubscribe(topic);
//     }
//   },
//   this.unsubscribeAll = function () {
//     if (self.subscribeCallbacks) {
//       for (const topic in self.subscribeCallbacks) {
//         if (self.subscribeCallbacks.hasOwnProperty(topic)) {
//           if (self.mqttClient) {
//             self.mqttClient.unsubscribe(topic);
//           }
//         }
//       }
//     }
//     self.subscribeCallbacks = {};
//   };
// }

// util.inherits(WiaStream, EventEmitter);

// module.exports = WiaStream;
