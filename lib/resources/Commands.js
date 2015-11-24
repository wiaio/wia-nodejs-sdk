'use strict';

var Error = require('../Error');
var request = require('request');

function WiaResourceCommands(wia) {
  this.register = function(opt, commandFunc, cb) {
    request.post(wia.getApiUrl() + "commands", {
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
}

module.exports = WiaResourceCommands;
