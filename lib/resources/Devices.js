'use strict';

var WiaExceptions = require('../WiaExceptions');
var request = require('request');

function WiaResourceDevices(wia) {
  this.create = function(opt, cb) {
    if (!opt) return cb(new WiaExceptions.WiaRequestException("Options cannot be null"));

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
          cb(new WiaExceptions.WiaRequestException(response.statusCode, body));
      }
    });
  },
  this.retrieve = function(opt, cb) {
    if (!opt) return cb(new WiaExceptions.WiaRequestException("Options cannot be null"));

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
            cb(new WiaExceptions.WiaRequestException(response.statusCode, body || ""));
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
            cb(new WiaExceptions.WiaRequestException(response.statusCode, body || ""));
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
          cb(new WiaExceptions.WiaRequestException(response.statusCode, body || ""));
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
          cb(new WiaExceptions.WiaRequestException(response.statusCode, body || ""));
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
          cb(new WiaExceptions.WiaRequestException(response.statusCode, body || ""));
      }
    });
  },
  this.subscribe = function(opt, cb) {
    if (!opt) return cb({message: "No options specified."});
    if (typeof opt === "object") {
      if (!opt.id) {
        return cb({message: "ID not specified." });
      }
      wia.stream.subscribe('devices/' + opt.id + '/#', cb);
    } else {
      wia.stream.subscribe('devices/' + opt + '/#', cb);
    }
  },
  this.unsubscribe = function(opt, cb) {
    if (!opt) return cb({message: "No options specified."});
    if (typeof opt === "object") {
      if (!opt.id) {
        return cb({message: "ID not specified." });
      }
      wia.stream.unsubscribe('devices/' + opt.id + '/#', cb);
    } else {
      wia.stream.unsubscribe('devices/' + opt + '/#', cb);
    }
  }
}

module.exports = WiaResourceDevices;
