'use strict';

Wia.DEFAULT_PROTOCOL = 'https';
Wia.DEFAULT_HOST = 'api.wia.io';
Wia.DEFAULT_PORT = '443';
Wia.DEFAULT_BASE_PATH = '/v1/';

Wia.DEFAULT_MQTT_PROTOCOL = 'mqtts';
Wia.DEFAULT_MQTT_HOST = 'api.wia.io';
Wia.DEFAULT_MQTT_PORT = '8883';

Wia.PACKAGE_VERSION = require('../package.json').version;

Wia.USER_AGENT = {
  bindings_version: Wia.PACKAGE_VERSION,
  lang: 'node',
  lang_version: process.version,
  platform: process.platform,
  publisher: 'wia'
};

var exec = require('child_process').exec;

var resources = {
  Devices: require('./resources/Devices'),
  Events: require('./resources/Events'),
  Customers : require('./resources/Customers'),
  Users : require('./resources/Users')
};

Wia.resources = resources;

function Wia(accessToken, orgSlug) {
  if (!(this instanceof Wia)) {
    return new Wia(accessToken, orgSlug);
  }

  this._api = {
    accessToken: null,
    protocol: Wia.DEFAULT_PROTOCOL,
    host: Wia.DEFAULT_HOST,
    port: Wia.DEFAULT_PORT,
    basePath: Wia.DEFAULT_BASE_PATH,
    mqttProtocol: Wia.DEFAULT_MQTT_PROTOCOL,
    mqttHost: Wia.DEFAULT_MQTT_HOST,
    mqttPort: Wia.DEFAULT_MQTT_PORT,
    agent: null,
    dev: false
  };

  this._prepResources();
  this.setAccessToken(accessToken);
  this.setOrganisationSlug(orgSlug);
}

Wia.prototype = {
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

  setAccessToken: function(accessToken) {
    if (accessToken) {
      this._setApiField('accessToken', accessToken);
    }
  },

  setOrganisationSlug: function(orgSlug) {
    if (orgSlug) {
      this._setApiField('organisationSlug', orgSlug);
    }
  },

  setDev: function(dev) {
    this._setApiField('dev', dev);
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
        return this.getApiField('protocol') + "://" + this.getApiField('organisationSlug') + ".wia.io:" + this.getApiField('port') + this.getApiField('basePath');
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
    return obj;
  },

  _prepResources: function() {
    for (var name in resources) {
      this[
        name[0].toLowerCase() + name.substring(1)
      ] = new resources[name](this);
    }
  }
};

module.exports = Wia;
