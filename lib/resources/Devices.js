'use strict';

var Error = require('../Error');
var request = require('request');

function WiaResourceDevices(wia) {
  this.create = function(opt, cb) {
    request.post(wia.getApiUrl() + "devices", {
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
  },
  this.retrieve = function(deviceKey, cb) {
    request.get(wia.getApiUrl() + "devices/" + deviceKey, {
      auth: {
        bearer: wia.getApiField('accessToken')
      },
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
  },
  this.update = function(deviceKey, opt, cb) {
    request.put(wia.getApiUrl() + "devices/" + deviceKey, {
      auth: {
        bearer: wia.getApiField('accessToken')
      },
      body: opt,
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
  },
  this.delete = function(deviceKey, cb) {
    request.del(wia.getApiUrl() + "devices/" + deviceKey, {
      auth: {
        bearer: wia.getApiField('accessToken')
      },
      json: true,
      headers: wia.getHeaders()
    }, function (error, response, body) {
      if (cb) {
        if (error) return cb(error, null);
        if (response.statusCode == 200)
          cb(null, true);
        else
          cb(new Error.WiaRequestException(response.statusCode, body || ""), null);
      }
    });
  },
  this.list = function(opt, cb) {
    request.get(wia.getApiUrl() + "devices", {
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
  },
  this.me = function(cb) {
    request.get(wia.getApiUrl() + "devices/me", {
      auth: {
        bearer: wia.getApiField('accessToken')
      },
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
  },
  this.subscribe = function(opt, cb) {
    if (wia.getApiField('restOnly')) {
      return cb({message: "restOnly must be set to false to subscribe to events." }, null);
    }
    if (!opt.deviceKey) {
      return cb({message: "deviceKey not specified." }, null);
    }
    wia.stream.subscribe('devices/' + opt.deviceKey + '/#', cb);
  },
  this.unsubscribe = function(opt, cb) {
    if (wia.getApiField('restOnly')) {
      return cb({message: "restOnly must be set to false to subscribe to events." }, null);
    }
    if (!opt.deviceKey) {
      return cb({message: "deviceKey not specified." }, null);
    }
    wia.stream.unsubscribe('devices/' + opt.deviceKey + '/#', cb);
  }
}

module.exports = WiaResourceDevices;
