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
  this.register = function(opt, commandFunc, cb) {
    request.post(wia.getApiUrl() + "functions/register", {
      auth: {
        bearer: wia.getApiField('accessToken')
      },
      body: opt,
      json: true,
      headers: wia.getHeaders()
    }, function (error, response, body) {
      if (cb) {
        if (error) return cb(error, null);
        if (response.statusCode == 200 || response.statusCode == 201) {
          console.log('devices/' + body.deviceKey + '/functions/' + opt.name + '/call');
          wia.stream.subscribe('devices/' + body.deviceKey + '/functions/' + opt.name + '/call', commandFunc);
          cb(null, body);
        } else {
          cb(new Error.WiaRequestException(response.statusCode, body || ""), null);
        }
      }
    });
  },
  this.deregister = function(opt, cb) {
    request.put(wia.getApiUrl() + "functions/deregister", {
      auth: {
        bearer: wia.getApiField('accessToken')
      },
      body: opt,
      json: true,
      headers: wia.getHeaders()
    }, function (error, response, body) {
      if (cb) {
        if (error) return cb(error, null);
        if (response.statusCode == 200 || response.statusCode == 201) {
          if (wia.clientInfo)
            wia.stream.unsubscribe('devices/' + wia.clientInfo.device.deviceKey + '/functions/' + opt.name + '/call');
          cb(null, body);
        } else {
          cb(new Error.WiaRequestException(response.statusCode, body || ""), null);
        }
      }
    });
  },
  this.call = function(opt, cb) {
    if (wia.stream && wia.stream.connected) {
      wia.stream.publish('devices/' + opt.deviceKey + '/functions/' + opt.name + '/call', opt.data ? JSON.stringify(opt.data) : null, cb);
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
