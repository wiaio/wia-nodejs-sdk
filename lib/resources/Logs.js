'use strict';

var WiaExceptions = require('../WiaExceptions');
var request = require('request');

function WiaResourceLogs(wia) {
  this.publish = function(opt, cb) {
    if (!opt) return cb(new WiaExceptions.WiaRequestException(400, "Object cannot be null."));

    if (!wia.stream || !wia.stream.connected || !wia.clientInfo) {
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
            cb(new WiaExceptions.WiaRequestException(response.statusCode, body || ""));
        }
      });
    } else {
      wia.stream.publish('devices/' + wia.clientInfo.id + '/logs/' + opt.level, JSON.stringify(opt), cb);
    }
  },
  this.subscribe = function(opt, cb) {
    if (!opt) return cb(new WiaExceptions.WiaRequestException(400, "Object cannot be null."));

    if (!opt.device) {
      return cb({message: "Device not specified." });
    }

    wia.stream.subscribe('devices/' + opt.device + '/logs/' + (opt.level || '+'), cb);
  },
  this.unsubscribe = function(opt, cb) {
    if (!opt) return cb(new WiaExceptions.WiaRequestException(400, "Object cannot be null."));

    if (!opt.device) {
      return cb({message: "Device not specified." });
    }

    wia.stream.unsubscribe('devices/' + opt.device + '/logs/' + (opt.level || '+'), cb);
  },
  this.list = function(opt, cb) {
    request.get(wia.getApiUrl() + "logs", {
      auth: {
        bearer: wia.getApiField('accessToken')
      },
      qs: opt || {},
      json: true,
      headers: wia.getHeaders()
    }, function (error, response, body) {
      if (cb) {
        if (error) return cb(error, null);
        if (response.statusCode == 200)
          cb(null, body);
        else
          cb(new WiaExceptions.WiaRequestException(response.statusCode, body || ""));
      }
    });
  }
}

module.exports = WiaResourceLogs;
