'use strict';

var utils = module.exports = {
  getUserAccessToken: function() {
    var key = process.env.USER_ACCESS_TOKEN;
    return key;
  },
  getUserUsername: function() {
    var key = process.env.USER_USERNAME;
    return key;
  },
  getUserPassword: function() {
    var key = process.env.USER_PASSWORD;
    return key;
  },
  getDeviceId: function() {
    var key = process.env.DEVICE_ID;
    return key;
  },
  getDeviceSecretKey: function() {
    var key = process.env.DEVICE_SECRET_KEY;
    return key;
  },
  getAppKey: function() {
    var key = process.env.WIA_TEST_APP_KEY;
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
