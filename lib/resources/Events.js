'use strict';

var Error = require('../Error');
var request = require('request');

function WiaResourceEvents(wia) {
  this.publish = function(opt, cb) {
    request.post(wia.getApiUrl() + "events", {
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
  this.subscribe = function(opt, cb) {
    console.log("TODO.");
  },
  this.unsubscribe = function(opt, cb) {
    console.log("TODO.");
  },
  this.list = function(opt, cb) {
    console.log("TODO.");    
  }
}

module.exports = WiaResourceEvents;
