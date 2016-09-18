'use strict';

Wia.DEFAULT_PROTOCOL = 'https';
Wia.DEFAULT_HOST = 'api.wia.io';
Wia.DEFAULT_PORT = '443';
Wia.DEFAULT_BASE_PATH = '/v1/';

Wia.DEFAULT_STREAM_PROTOCOL = 'mqtts';
Wia.DEFAULT_STREAM_HOST = 'api.wia.io';
Wia.DEFAULT_STREAM_PORT = '8883';

Wia.PACKAGE_VERSION = require('./package.json').version;

Wia.USER_AGENT = {
  bindings_version: Wia.PACKAGE_VERSION,
  lang: 'node',
  lang_version: process.version,
  platform: process.platform,
  publisher: 'wia'
};

var os = require('os');
var exec = require('child_process').exec;

var resources = {
  Commands : require('./lib/resources/Commands'),
  Devices: require('./lib/resources/Devices'),
  Events: require('./lib/resources/Events'),
  Functions : require('./lib/resources/Functions'),
  Locations : require('./lib/resources/Locations'),
  Logs : require('./lib/resources/Logs'),
  Organisations : require('./lib/resources/Organisations'),
  Sensors : require('./lib/resources/Sensors'),
  TeamMembers : require('./lib/resources/TeamMembers'),
  Users : require('./lib/resources/Users')
};

Wia.resources = resources;

var WiaStream = require('./lib/WiaStream');
var request = require('request');
var Error = require('./lib/Error');
var fs = require('fs');
var os = require('os');

function Wia(opt) {
  var self = this;

  if (!(this instanceof Wia)) {
    return new Wia(opt);
  }

  this._api = {
    accessToken: null,
    publicKey: null,
    secretKey: null,
    appKey: null,
    rest: {
      host: Wia.DEFAULT_HOST,
      port: Wia.DEFAULT_PORT,
      protocol: Wia.DEFAULT_PROTOCOL,
      basePath: Wia.DEFAULT_BASE_PATH
    },
    stream: {
      protocol: Wia.DEFAULT_STREAM_PROTOCOL,
      host: Wia.DEFAULT_STREAM_HOST,
      port: Wia.DEFAULT_STREAM_PORT
    },
    agent: null,
    debug: false,
    enableCommands: true
  };

  this._prepResources();
  this._prepStream();

  if (!opt || opt.length == 0) {
    var contents = fs.readFileSync(os.homedir() + '/.wia/config', 'utf8');
    if (contents) {
      var contentsObj = JSON.parse(contents);
      if (contentsObj) {
        for (var k in contentsObj) {
          if (opt.hasOwnProperty(k)) {
             this._api[k] = contentsObj[k];
          }
        }

        this.setAccessToken(contentsObj.accessToken || contentsObj.secretKey);
      }
    }
  } else if (typeof opt === "object") {
    for (var k in opt) {
      if (opt.hasOwnProperty(k)) {
         this._api[k] = opt[k];
      }
    }

    this.setAccessToken(opt.accessToken || opt.secretKey);
  } else {
    this.setAccessToken(opt);
  }
}

Wia.prototype = {
  setAccessToken: function(accessToken) {
    if (accessToken) {
      this._setApiField('accessToken', accessToken);
      var self = this;
      request.get(self.getApiUrl() + "whoami", {
        auth: {
          bearer: self.getApiField('accessToken')
        },
        json: true,
        headers: self.getHeaders()
      }, function (error, response, body) {
        if (error) throw new Error.WiaRequestException(0, error);
        if (response.statusCode == 200) {
          self.clientInfo = body;

          if (self.clientInfo.device) {
            self.devices.update("me", {
              systemInformation: {
                arch: os.arch(),
                cpus: os.cpus(),
                hostname: os.hostname(),
                networkInterfaces: os.networkInterfaces(),
                platform: os.platform(),
                totalmem: os.totalmem(),
                type: os.type()
              }
            }, function(err, data) {
              if (err) console.log(err);
            });
          }
        } else {
          throw new Error.WiaRequestException(response.statusCode, body || "");
        }
      });
    }
  },

  _setApiField: function(key, value) {
    this._api[key] = value;
  },

  getApiField: function(key, subkey) {
    if (subkey) {
      return this._api[key][subkey];
    }
    return this._api[key];
  },

  getApiUrl: function() {
    return this.getApiField('rest', 'protocol') + "://" + this.getApiField('rest', 'host') + ":" + this.getApiField('rest', 'port') + this.getApiField('rest', 'basePath');
  },

  getConstant: function(c) {
    return Wia[c];
  },

  getClientUserAgent: function(cb) {
    if (Wia.USER_AGENT_SERIALIZED) {
      return cb(Wia.USER_AGENT_SERIALIZED);
    }
    exec('uname -a', function(err, uname) {
      Wia.USER_AGENT.uname = uname || 'UNKNOWN';
      Wia.USER_AGENT_SERIALIZED = JSON.stringify(Wia.USER_AGENT);
      cb(Wia.USER_AGENT_SERIALIZED);
    });
  },

  getHeaders: function() {
    var obj = {};
    if (this.getApiField('publicKey')) {
      obj['x-org-public-key'] = this.getApiField('publicKey');
    }
    return obj;
  },

  generateAccessToken: function(data, cb) {
    request.post(this.getApiUrl() + "auth/token", {
      body: data,
      json: true,
      headers: this.getHeaders()
    }, function (error, response, body) {
      if (cb) {
        if (error) return cb(error, null);
        if (response.statusCode)
          cb(null, body);
        else
          cb(new Error.WiaRequestException(response.statusCode, body || ""), null);
      }
    });
  },

  _prepResources: function() {
    for (var name in resources) {
      this[
        name[0].toLowerCase() + name.substring(1)
      ] = new resources[name](this);
    }
  },

  _prepStream: function() {
    this.stream = new WiaStream(this);
  }
};

module.exports = Wia;
