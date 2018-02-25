'use strict';

var utils = module.exports = {
  getUserUsername: function() {
    var key = process.env.WIA_TEST_USER_USERNAME;
    return key;
  },
  getUserPassword: function() {
    var key = process.env.WIA_TEST_USER_PASSWORD;
    return key;
  },
  getDeviceSecretKey: function() {
    var key = process.env.WIA_TEST_DEVICE_SECRET_KEY;
    return key;
  },
  getStreamConfig: function() {
    return {
      protocol: process.env.WIA_TEST_STREAM_PROTOCOL || "mqtt",
      host: process.env.WIA_TEST_STREAM_HOST || "api.wia.io",
      port: process.env.WIA_TEST_STREAM_PORT || 1883
    };
  }
}
