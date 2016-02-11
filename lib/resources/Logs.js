'use strict';

var Error = require('../Error');
var request = require('request');

function WiaResourceLogs(wia) {
  this.publish = function(opt, cb) {
    if (!opt) return cb(new Error.WiaRequestException(400, "Object cannot be null."), null);

    if (wia.getApiField('restOnly') || !wia.stream || !wia.stream.connected) {
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
      wia.stream.publish('devices/' + wia.clientInfo.device.id + '/logs/' + opt.level, JSON.stringify(opt), cb);
    }
  },
  this.subscribe = function(opt, cb) {
    if (wia.getApiField('restOnly')) {
      return cb({message: "restOnly must be set to false to subscribe to logs." }, null);
    }
    if (!opt.id) {
      return cb({message: "ID not specified." }, null);
    }
    if (!opt.level) {
      wia.stream.subscribe('devices/' + opt.id + '/logs/+', cb);
    } else {
      wia.stream.subscribe('devices/' + opt.id + '/logs/' + opt.level, cb);
    }
  },
  this.unsubscribe = function(opt, cb) {
    if (wia.getApiField('restOnly')) {
      return cb({message: "restOnly must be set to false to subscribe to logs." }, null);
    }
    if (!opt.id) {
      return cb({message: "ID not specified." }, null);
    }
    if (!opt.level) {
      wia.stream.unsubscribe('devices/' + opt.id + '/logs/+', cb);
    } else {
      wia.stream.unsubscribe('devices/' + opt.id + '/logs/' + opt.level, cb);
    }
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
          cb(new Error.WiaRequestException(response.statusCode, body || ""), null);
      }
    });
  }
}

module.exports = WiaResourceLogs;
