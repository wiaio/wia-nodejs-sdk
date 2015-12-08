'use strict';

var Error = require('../Error');
var request = require('request');

function WiaResourceCommands(wia) {
  this.run = function(opt, cb) {
    if (wia.stream && wia.stream.connected) {
      wia.stream.publish('devices/' + opt.deviceKey + '/commands/run', opt ? JSON.stringify(opt) : null, cb);
    } else {
      setTimeout(function() {
        if (wia.stream && wia.stream.connected) {
          wia.stream.publish('devices/' + opt.deviceKey + '/commands/run', opt ? JSON.stringify(opt) : null, cb);
        } else {
          console.log("Must be connected to the stream to send commands. Try using wia.stream.connect();");
        }
      }, 1250);
    }
  }
}

module.exports = WiaResourceCommands;
