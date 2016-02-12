'use strict';

Wia.DEFAULT_PROTOCOL = 'https';
Wia.DEFAULT_HOST = 'api.wia.io';
Wia.DEFAULT_PORT = '443';
Wia.DEFAULT_BASE_PATH = '/v1/';

Wia.DEFAULT_MQTT_PROTOCOL = 'mqtts';
Wia.DEFAULT_MQTT_HOST = 'api.wia.io';
Wia.DEFAULT_MQTT_PORT = '8883';

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
  Logs : require('./lib/resources/Logs'),
  Organisations : require('./lib/resources/Organisations'),
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
    protocol: Wia.DEFAULT_PROTOCOL,
    host: Wia.DEFAULT_HOST,
    port: Wia.DEFAULT_PORT,
    basePath: Wia.DEFAULT_BASE_PATH,
    mqttProtocol: Wia.DEFAULT_MQTT_PROTOCOL,
    mqttHost: Wia.DEFAULT_MQTT_HOST,
    mqttPort: Wia.DEFAULT_MQTT_PORT,
    agent: null,
    dev: false,
    stream: true,
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
  connectToStream: function() {
    if (this.stream) {
      this.stream.connectToStream();
    }
  },

  setHost: function(host, port, protocol) {
    this._setApiField('host', host);
    if (port) this.setPort(port);
    if (protocol) this.setProtocol(protocol);
  },

  setPort: function(port) {
    this._setApiField('port', port);
  },

  setProtocol: function(protocol) {
    this._setApiField('protocol', protocol);
  },

  setMqttHost: function(mqttHost, mqttPort, mqttProtocol) {
    this._setApiField('mqttHost', mqttHost);
    if (mqttPort) this.setMqttPort(mqttPort);
    if (mqttProtocol) this.setMqttProtocol(mqttProtocol);
  },

  setMqttPort: function(mqttPort) {
    this._setApiField('mqttPort', mqttPort);
  },

  setMqttProtocol: function(mqttProtocol) {
    this._setApiField('mqttProtocol', mqttProtocol);
  },

  setRestOnly: function(restOnly) {
    this._setApiField('restOnly', restOnly);
  },

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
            });
          }

          if (self.getApiField('stream'))
            self.stream.connect();
        } else {
          throw new Error.WiaRequestException(response.statusCode, body || "");
        }
      });
    }
  },

  setPublicKey: function(publicKey) {
    if (publicKey) {
      this._setApiField('publicKey', publicKey);
    }
  },

  setSecretKey: function(secretKey) {
    if (secretKey) {
      this._setApiField('secretKey', secretKey);
      console.log("INN");
      this._setApiField('accessToken', secretKey);
    }
  },

  setOrganisationSlug: function(organisationSlug) {
    if (organisationSlug) {
      this._setApiField('organisationSlug', organisationSlug);
    }
  },

  setDev: function(dev) {
    this._setApiField('dev', dev);
  },

  setEnableCommands: function(enableCommands) {
    this._setApiField('enableCommands', enableCommands);
  },

  _setApiField: function(key, value) {
    this._api[key] = value;
  },

  getApiField: function(key) {
    return this._api[key];
  },

  getApiUrl: function() {
    if (!this.getApiField('dev')) {
      if (this.getApiField('organisationSlug')) {
        return this.getApiField('protocol') + "://" + this.getApiField('organisationSlug') + ".wia.io:" + this.getApiField('port') + "/api" + this.getApiField('basePath');
      }
    }
    return this.getApiField('protocol') + "://" + this.getApiField('host') + ":" + this.getApiField('port') + this.getApiField('basePath');
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
    if (this.getApiField('dev')) {
      if (this.getApiField('organisationSlug')) {
        obj['x-org-slug'] = this.getApiField('organisationSlug');
      }
    }
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
