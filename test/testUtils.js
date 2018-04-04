'use strict';

var utils = module.exports = {
  getUserUsername: function() {
    var key = process.env.WUSER_USERNAME;
    return key;
  },
  getUserPassword: function() {
    var key = process.env.USER_PASSWORD;
    return key;
  },
  getDeviceSecretKey: function() {
    var key = process.env.DEVICE_SECRET_KEY;
    return key;
  },
  getStreamConfig: function() {
    return {
      protocol: process.env.STREAM_PROTOCOL || "mqtts",
      host: process.env.STREAM_HOST || "mqtt.wia.io",
      port: process.env.STREAM_PORT || 8883
    };
  }
}
