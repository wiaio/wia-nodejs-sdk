'use strict';

var utils = module.exports = {
  getUserSecretKey: function() {
    var key = process.env.WIA_TEST_USER_SECRET_KEY;
    return key;
  },
  getDeviceSecretKey: function() {
    var key = process.env.WIA_TEST_DEVICE_SECRET_KEY;
    return key;
  }
}
