'use strict';

var WiaExceptions = require('../WiaExceptions');
var request = require('request');

function WiaResourceCommands(wia) {
  this.subscribe = function(opt, cb) {
    if (!opt) return cb({message: "No options specified."});
    if (typeof wia.clientInfo !== 'undefined' && typeof wia.clientInfo.id !== 'undefined') {
      wia.stream.subscribe('devices/' + wia.clientInfo.id + '/commands/' + opt.slug + '/run', cb);
    } else {
      setTimeout(function() {
        if (typeof wia.clientInfo !== 'undefined' && typeof wia.clientInfo.id !== 'undefined') {
          wia.stream.subscribe('devices/' + wia.clientInfo.id + '/commands/' + opt.slug + '/run', cb);
        }
      }, 5000);
    }
  },
  this.run = function(opt, cb) {
    if (!opt) return cb({message: "No options specified."});

    if (opt.device && opt.device.id && wia.stream && wia.stream.connected) {
      wia.stream.publish('devices/' + opt.device.id + '/commands/' + (opt.slug || opt.name) + '/run', opt.data ? JSON.stringify(opt.data) : null, cb);
    } else {
      request.post(wia.getApiUrl() + "commands/run", {
        auth: {
          bearer: wia.getApiField('accessToken')
        },
        body: opt && typeof opt === "object" ? opt : {},
        json: true,
        headers: wia.getHeaders()
      }, function (error, response, body) {
        if (cb) {
          if (error) return cb(error, null);
          if (response.statusCode == 200 || response.statusCode == 201)
            cb(null, body);
          else
            cb(new WiaExceptions.WiaRequestException(response.statusCode, body || ""), null);
        }
      });
    }
  }
}

module.exports = WiaResourceCommands;
