'use strict';

var Error = require('../Error');
var request = require('request');

function WiaResourceUsers(wia) {
  this.create = function(opt, cb) {
    request.post(wia.getApiUrl() + "users", {
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
  this.retrieve = function(userKey, cb) {
    if (typeof opt === "string") {
      request.get(wia.getApiUrl() + "users/" + opt, {
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
      request.get(wia.getApiUrl() + "users/" + opt.userKey, {
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
  this.update = function(userKey, opt, cb) {
    request.put(wia.getApiUrl() + "users/" + userKey, {
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
  this.delete = function(userKey, cb) {
    request.del(wia.getApiUrl() + "users/" + userKey, {
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
    request.get(wia.getApiUrl() + "users", {
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
  this.login = function(opt, cb) {
    request.post(wia.getApiUrl() + "auth/token", {
      auth: {
        bearer: wia.getApiField('publicKey')
      },
      body: opt,
      json: true,
      headers: wia.getHeaders()
    }, function (error, response, body) {
      if (cb) {
        if (error) return cb(error, null);
        if (response.statusCode == 200 || response.statusCode == 201) {
          if (body) {
            if (body.accessToken) {
              wia.setAccessToken(body.accessToken);
            }
          }
          cb(null, body);
        } else
          cb(new Error.WiaRequestException(response.statusCode, body || ""), null);
      }
    });
  }
}

module.exports = WiaResourceUsers;
