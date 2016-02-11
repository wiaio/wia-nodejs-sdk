'use strict';

var Error = require('../Error');
var request = require('request');

function WiaResourceFunctions(wia) {
  this.list = function(opt, cb) {
    request.get(wia.getApiUrl() + "functions", {
      auth: {
        bearer: wia.getApiField('accessToken')
      },
      qs: opt || {},
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
  },
  this.create = function(opt, func, cb) {
    request.post(wia.getApiUrl() + "functions", {
      auth: {
        bearer: wia.getApiField('accessToken')
      },
      body: opt,
      json: true,
      headers: wia.getHeaders()
    }, function (error, response, body) {
      if (error && cb) return cb(error, null);
      if (response.statusCode == 200 || response.statusCode == 201) {
        wia.stream.subscribe('devices/' + body.device.id + '/functions/' + body.functionKey + '/call', func);
        if (cb)
          cb(null, body);
      } else {
        if (cb)
          cb(new Error.WiaRequestException(response.statusCode, body || ""), null);
      }
    });
  },
  this.update = function(opt, cb) {
    request.put(wia.getApiUrl() + "functions", {
      auth: {
        bearer: wia.getApiField('accessToken')
      },
      body: opt,
      json: true,
      headers: wia.getHeaders()
    }, function (error, response, body) {
      if (error && cb) return cb(error, null);
      if (response.statusCode == 200 || response.statusCode == 201) {
        if (wia.clientInfo && wia.clientInfo.device)
          wia.stream.unsubscribe('devices/' + wia.clientInfo.device.id + '/functions/' + opt.name + '/call');
        else if (body.device && body.device.id)
          wia.stream.unsubscribe('devices/' + body.device.id + '/functions/' + opt.name + '/call');
        if (cb)
          cb(null, body);
      } else {
        if (cb)
          cb(new Error.WiaRequestException(response.statusCode, body || ""), null);
      }
    });
  },
  this.call = function(opt, cb) {
    if (wia.stream && wia.stream.connected) {
      wia.stream.publish('devices/' + opt.device + '/functions/' + opt.function + '/call', opt.data ? JSON.stringify(opt.data) : null, cb);
    } else {
      request.post(wia.getApiUrl() + "functions/call", {
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
    }
  }
}

module.exports = WiaResourceFunctions;
