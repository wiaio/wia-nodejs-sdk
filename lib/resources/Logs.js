'use strict';

var Error = require('../Error');
var request = require('request');

function WiaResourceLogs(wia) {
  this.publish = function(opt, cb) {
    if (wia.getApiField('restOnly')) {
      request.post(wia.getApiUrl() + "logs", {
        auth: {
          bearer: wia.getApiField('accessToken')
        },
        body: opt,
        json: true,
        headers: wia.getHeaders()
      }, function (error, response, body) {
        if (cb) {
          if (error) return cb(error, null);
          if (response.statusCode == 200 || response.statusCode == 201)
            cb(null, body);
          else
            cb(new Error.WiaRequestException(response.statusCode, body || ""), null);
        }
      });
    } else {
      if (!opt.level) {
        return cb({message: "level must be specified."}, null);
      }
      wia.stream.publish('device/log', JSON.stringify(opt), cb);
      // wia.stream.publish('devices/' + "key" + '/log/' + opt.level, JSON.stringify(opt), cb);
    }
  },
  this.subscribe = function(opt, cb) {
    if (wia.getApiField('restOnly')) {
      return cb({message: "restOnly must be set to false to subscribe to logs." }, null);
    }
    if (!opt.deviceKey) {
      return cb({message: "deviceKey not specified." }, null);
    }
    if (!opt.level) {
      wia.stream.subscribe('devices/' + opt.deviceKey + '/logs/+', cb);
    } else {
      wia.stream.subscribe('devices/' + opt.deviceKey + '/logs/' + opt.level, cb);
    }
  },
  this.unsubscribe = function(opt, cb) {
    if (wia.getApiField('restOnly')) {
      return cb({message: "restOnly must be set to false to subscribe to logs." }, null);
    }
    if (!opt.deviceKey) {
      return cb({message: "deviceKey not specified." }, null);
    }
    if (!opt.level) {
      wia.stream.unsubscribe('devices/' + opt.deviceKey + '/logs/+', cb);
    } else {
      wia.stream.unsubscribe('devices/' + opt.deviceKey + '/logs/' + opt.name, cb);
    }
  },
  this.list = function(opt, cb) {
    console.log("TODO.");
  }
}

module.exports = WiaResourceLogs;
