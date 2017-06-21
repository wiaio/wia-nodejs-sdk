'use strict';

var WiaExceptions = require('../WiaExceptions');
var request = require('request');

function WiaResourceTeamMembers(wia) {
  this.create = function(opt, cb) {
    request.post(wia.getApiUrl() + "teamMembers", {
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
          cb(null, body || true);
        else
          cb(new WiaExceptions.WiaRequestException(response.statusCode, body || ""));
      }
    });
  },
  this.retrieve = function(opt, cb) {
    if (typeof opt === "string") {
      request.get(wia.getApiUrl() + "teamMembers/" + opt, {
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
      request.get(wia.getApiUrl() + "teamMembers/" + opt.id, {
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
    request.put(wia.getApiUrl() + "teamMembers/" + id, {
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
    request.del(wia.getApiUrl() + "teamMembers/" + id, {
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
    request.get(wia.getApiUrl() + "teamMembers", {
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
  }
}

module.exports = WiaResourceTeamMembers;
