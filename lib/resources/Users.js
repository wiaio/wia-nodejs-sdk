'use strict';

var WiaExceptions = require('../WiaExceptions');
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
          cb(new WiaExceptions.WiaRequestException(response.statusCode, body || ""));
      }
    });
  },
  this.retrieve = function(opt, cb) {
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
            cb(new WiaExceptions.WiaRequestException(response.statusCode, body || ""));
        }
      });
    } else if (typeof opt === "object") {
      request.get(wia.getApiUrl() + "users/" + opt.id, {
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
    request.put(wia.getApiUrl() + "users/" + id, {
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
    request.del(wia.getApiUrl() + "users/" + id, {
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
          cb(new WiaExceptions.WiaRequestException(response.statusCode, body || ""));
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
          cb(new WiaExceptions.WiaRequestException(response.statusCode, body || ""));
      }
    });
  },
  this.logout = function(opt, cb) {
    request.post(wia.getApiUrl() + "auth/revoke", {
      auth: {
        bearer: wia.getApiField('accessToken')
      },
      json: true,
      headers: wia.getHeaders()
    }, function (error, response, body) {
      if (cb) {
        if (error) return cb(error);
        if (response.statusCode == 200) {
          wia.setAccessToken(null);
          cb(null, true);
        } else {
          cb(new WiaExceptions.WiaRequestException(response.statusCode, body || ""));
        }
      }
    });
  },
  this.addDevice = function(userId, deviceId, cb) {
    request.post(wia.getApiUrl() + "users/" + userId + "/devices", {
      auth: {
        bearer: wia.getApiField('accessToken')
      },
      body: { device: deviceId },
      json: true,
      headers: wia.getHeaders()
    }, function (error, response, body) {
      if (cb) {
        if (error) return cb(error, null);
        if (response.statusCode == 200 || response.statusCode == 201)
          cb(null, true);
        else
          cb(new WiaExceptions.WiaRequestException(response.statusCode, body || ""));
      }
    });
  },
  this.removeDevice = function(userId, deviceId, cb) {
    request.del(wia.getApiUrl() + "users/" + userId + "/devices/" + deviceId, {
      auth: {
        bearer: wia.getApiField('accessToken')
      },
      json: true,
      headers: wia.getHeaders()
    }, function (error, response, body) {
      if (cb) {
        if (error) return cb(error);
        if (response.statusCode == 200)
          cb(null, true);
        else
          cb(new WiaExceptions.WiaRequestException(response.statusCode, body || ""));
      }
    });
  },
  this.listDevices = function(userId, opt, cb) {
    request.get(wia.getApiUrl() + "users/" + userId + "/devices", {
      auth: {
        bearer: wia.getApiField('accessToken')
      },
      qs: opt || null,
      json: true,
      headers: wia.getHeaders()
    }, function (error, response, body) {
      if (cb) {
        if (error) return cb(error);
        if (response.statusCode == 200)
          cb(null, body);
        else
          cb(new WiaExceptions.WiaRequestException(response.statusCode, body || ""));
      }
    });
  }
}

module.exports = WiaResourceUsers;
