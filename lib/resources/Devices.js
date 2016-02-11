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
  this.retrieve = function(opt, cb) {
    if (!opt) return cb(new Error.WiaRequestException("Options cannot be null"));

    if (typeof opt === "string") {
      request.get(wia.getApiUrl() + "devices/" + opt, {
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
    } else if (typeof opt === "object") {
      request.get(wia.getApiUrl() + "devices/" + opt.id, {
        auth: {
          bearer: wia.getApiField('accessToken')
        },
        json: true,
        headers: wia.getHeaders(),
        qs: opt || null
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
  },
  this.update = function(id, opt, cb) {
    request.put(wia.getApiUrl() + "devices/" + id, {
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
  this.delete = function(id, cb) {
    request.del(wia.getApiUrl() + "devices/" + id, {
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
  this.subscribe = function(opt, cb) {
    if (wia.getApiField('restOnly')) {
      return cb({message: "restOnly must be set to false to subscribe to events." }, null);
    }
    if (!opt.id) {
      return cb({message: "ID not specified." }, null);
    }
    wia.stream.subscribe('devices/' + opt.id + '/#', cb);
  },
  this.unsubscribe = function(opt, cb) {
    if (wia.getApiField('restOnly')) {
      return cb({message: "restOnly must be set to false to subscribe to events." }, null);
    }
    if (!opt.id) {
      return cb({message: "ID not specified." }, null);
    }
    wia.stream.unsubscribe('devices/' + opt.id + '/#', cb);
  }
}

module.exports = WiaResourceDevices;
