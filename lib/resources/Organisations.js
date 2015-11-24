'use strict';

var Error = require('../Error');
var request = require('request');

function WiaResourceOrganisations(wia) {
  this.me = function(cb) {
    request.get(wia.getApiUrl() + "organisations/me", {
      auth: {
        bearer: wia.getApiField('accessToken')
      },
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

module.exports = WiaResourceOrganisations;
