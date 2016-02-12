'use strict';

var Error = require('../Error');
var request = require('request');

function WiaResourceFunctions(wia) {
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
          cb(new Error.WiaRequestException(response.statusCode, body || ""));
      }
    });
  },
  this.retrieve = function(id, opt, cb) {
    if (!id) return cb({message: "ID not specified."});

    request.put(wia.getApiUrl() + "functions/" + id, {
      auth: {
        bearer: wia.getApiField('accessToken')
      },
      qs: opt || {},
      json: true,
      headers: wia.getHeaders()
    }, function (error, response, body) {
      if (error && cb) return cb(error);
      if (response.statusCode == 200)
        cb(null, body);
      else
        cb(new Error.WiaRequestException(response.statusCode, body || ""));
    });
  },
  this.update = function(id, opt, cb) {
    if (!id) return cb({message: "ID not specified."});
    if (!opt) return cb({message: "No options specified."});

    request.put(wia.getApiUrl() + "functions/" + id, {
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
          cb(new Error.WiaRequestException(response.statusCode, body || ""));
      }
    });
  },
  this.delete = function(id, cb) {
    if (!id) return cb({message: "ID not specified."});

    request.delete(wia.getApiUrl() + "functions/" + id, {
      auth: {
        bearer: wia.getApiField('accessToken')
      },
      json: true,
      headers: wia.getHeaders()
    }, function (error, response, body) {
      if (error && cb) return cb(error, null);
      if (response.statusCode == 200)
        cb(null, body);
      else
        cb(new Error.WiaRequestException(response.statusCode, body || ""));
    });
  },
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
        if (response.statusCode == 200)
          cb(null, body);
        else
          cb(new Error.WiaRequestException(response.statusCode, body || ""));
      }
    });
  },
  this.call = function(opt, cb) {
    if (!opt) return cb({message: "No options specified."});

    if (typeof opt === "object" && wia.stream && wia.stream.connected) {
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
