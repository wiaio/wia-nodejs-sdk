'use strict';

var WiaExceptions = require('../WiaExceptions');
var request = require('request');

function WiaResourceSpaces(wia) {
    this.create = function(opt, cb) {
        if (!opt) return cb(new WiaExceptions.WiaRequestException(400, "Object cannot be null."));

        if (opt.file) {
            var options = {
                uri: wia.getApiUrl() + "spaces",
                formData: {
                    name: opt.name,
                    file: opt.file
                },
                auth: {
                    bearer: wia.getApiField('accessToken')
                }
            };

            request.post(options, function (error, response, body) {
                if (cb) {
                    if (error) return cb(error, null);
                    if (response.statusCode == 200 || response.statusCode == 201)
                        cb(null, body);
                    else
                        cb(new WiaExceptions.WiaRequestException(response.statusCode, body || ""));
                }
            });
        } else  {
            request.post(wia.getApiUrl() + "spaces", {
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
                        cb(new WiaExceptions.WiaRequestException(response.statusCode, body || ""), null);
                }
            });
        }
    },
        this.retrieve = function(opt, cb) {
            request.get(wia.getApiUrl() + "spaces/" + opt.id, {
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
        },
        this.update = function(opt, cb) {
            request.put(wia.getApiUrl() + "spaces/" + id, {
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
        this.list = function(opt, cb) {
            request.get(wia.getApiUrl() + "spaces", {
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
                        cb(new WiaExceptions.WiaRequestException(response.statusCode, body || ""), null);
                }
            });
        }
}

module.exports = WiaResourceSpaces;
