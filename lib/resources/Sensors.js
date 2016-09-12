'use strict';

var Error = require('../Error');
var request = require('request');

function WiaResourceSensors(wia) {
  this.publish = function(opt, cb) {
    if (!opt) return cb(new Error.WiaRequestException(400, "Object cannot be null."));

    if (!wia.stream || !wia.stream.connected || !wia.clientInfo) {
      request.post(wia.getApiUrl() + "sensors", {
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
      if (!opt.name) {
        return cb({message: "name must be specified."}, null);
      }
      wia.stream.publish('devices/' + wia.clientInfo.device.id + '/sensors/' + opt.name, JSON.stringify(opt), cb);
    }
  },
  this.subscribe = function(opt, cb) {
    if (!opt) return cb({message: "No options specified."});
    if (!opt.device) {
      return cb({message: "Device not specified." }, null);
    }
    wia.stream.subscribe('devices/' + opt.device + '/sensors/' + (opt.name || '+'), cb);
  },
  this.unsubscribe = function(opt, cb) {
    if (!opt) return cb({message: "No options specified."});
    if (!opt.device) {
      return cb({message: "Device not specified." }, null);
    }
    wia.stream.unsubscribe('devices/' + opt.device + '/sensors/' + (opt.name || '+'), cb);
  },
  this.list = function(opt, cb) {
    request.get(wia.getApiUrl() + "sensors", {
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

module.exports = WiaResourceSensors;
