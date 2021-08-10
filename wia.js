const os = require('os');
const { exec } = require('child_process');
const got = require('got');

const fs = require('fs');
const WiaStream = require('./lib/WiaStream');
const WiaExceptions = require('./lib/WiaExceptions');

const packageJson = require('./package.json');

const DevicesResource = require('./lib/resources/Devices');
const EventsResource = require('./lib/resources/Events');
// const LocationsResource = require('./lib/resources/Locations');
// const SpacesResource = require('./lib/resources/Spaces');
// const UsersResource = require('./lib/resources/Users');

const resources = {
  Devices: DevicesResource,
  Events: EventsResource,
  // Locations: LocationsResource,
  // Spaces: SpacesResource,
  // Users: UsersResource,
};

class Wia {
  constructor(opt) {
    // if (!(this instanceof Wia)) {
    //   return new Wia(opt);
    // }

    this.opt = opt;

    this.DEFAULT_PROTOCOL = 'https';
    this.DEFAULT_HOST = 'api.wia.io';
    this.DEFAULT_PORT = '443';
    this.DEFAULT_BASE_PATH = '/v1/';

    this.DEFAULT_STREAM_PROTOCOL = 'mqtt';
    this.DEFAULT_STREAM_HOST = 'api.wia.io';
    this.DEFAULT_STREAM_PORT = '1883';

    this.DEFAULT_CONFIG_FILE_PATH = `${os.homedir()}/.wia/config`;

    this.PACKAGE_VERSION = packageJson.version;

    this.USER_AGENT = {
      bindings_version: this.PACKAGE_VERSION,
      lang: 'node',
      lang_version: process.version,
      platform: process.platform,
      publisher: 'wia',
    };

    this.resources = resources;

    this._api = {
      accessToken: null,
      appKey: null,
      rest: {
        host: this.DEFAULT_HOST,
        port: this.DEFAULT_PORT,
        protocol: this.DEFAULT_PROTOCOL,
        basePath: this.DEFAULT_BASE_PATH,
      },
      stream: {
        protocol: this.DEFAULT_STREAM_PROTOCOL,
        host: this.DEFAULT_STREAM_HOST,
        port: this.DEFAULT_STREAM_PORT,
      },
      agent: null,
      debug: false,
      enableCommands: true,
    };

    this._prepResources();
    // this._prepStream();

    if (!opt || opt.length === 0) {
      const configFilePath = process.env.WIA_CONFIG_FILE_PATH || Wia.DEFAULT_CONFIG_FILE_PATH;
      if (fs.existsSync(configFilePath)) {
        const contents = fs.readFileSync(configFilePath, 'utf8');
        if (contents) {
          const contentsObj = JSON.parse(contents);
          if (contentsObj) {
            for (const k in contentsObj) {
              // eslint-disable-next-line no-prototype-builtins
              if (opt.hasOwnProperty(k)) {
                this._api[k] = contentsObj[k];
              }
            }

            this.setAccessToken(contentsObj.accessToken);
          }
        }
      }
    } else if (typeof opt === 'object') {
      for (const k in opt) {
        // eslint-disable-next-line no-prototype-builtins
        if (opt.hasOwnProperty(k)) {
          this._api[k] = opt[k];
        }
      }
      this.setAccessToken(opt.accessToken || opt.secretKey);
    } else {
      this.setAccessToken(opt);
    }
  }

  async setAccessToken(accessToken) {
    if (!accessToken) {
      throw new WiaExceptions.ValidationError('accessToken param is required.');
    }

    this._setApiField('accessToken', accessToken);
    try {
      const response = await got(`${this.getApiUrl()}whoami`, {
        responseType: 'json',
        headers: this.getHeaders(),
      });

      if (response.statusCode === 200) {
        this.clientInfo = response.body;
        return this.clientInfo;
      }
      throw new WiaExceptions.HTTPBadRequestError(response.statusCode, response.body);
    // eslint-disable-next-line no-empty
    } catch (e) { }
    return null;
  }

  getAccessToken() {
    return this.getApiField('accessToken');
  }

  _setApiField(key, value) {
    this._api[key] = value;
  }

  getApiField(key, subkey) {
    if (subkey) {
      return this._api[key][subkey];
    }
    return this._api[key];
  }

  getApiUrl() {
    return `${this.getApiField('rest', 'protocol')}://${this.getApiField('rest', 'host')}:${this.getApiField('rest', 'port')}${this.getApiField('rest', 'basePath')}`;
  }

  getClientUserAgent(cb) {
    if (Wia.USER_AGENT_SERIALIZED) {
      return cb(Wia.USER_AGENT_SERIALIZED);
    }
    return exec('uname -a', (err, uname) => {
      Wia.USER_AGENT.uname = uname || 'UNKNOWN';
      Wia.USER_AGENT_SERIALIZED = JSON.stringify(Wia.USER_AGENT);
      cb(Wia.USER_AGENT_SERIALIZED);
    });
  }

  getHeaders() {
    const obj = {};
    if (this.getApiField('appKey')) {
      obj['x-app-key'] = this.getApiField('appKey');
    }
    if (this.getApiField('accessToken')) {
      obj.authorization = `bearer ${this.getApiField('accessToken')}`;
    }
    return obj;
  }

  async generateAccessToken(data) {
    const response = await got.post(`${this.getApiUrl()}auth/token`, {
      json: data,
      responseType: 'json',
      headers: this.getHeaders(),
    });

    if (response.statusCode === 200 || response.statusCode === 201) {
      return response.body;
    }
    throw new WiaExceptions.HTTPBadRequestError(response.statusCode, response.body);
  }

  async whoami() {
    const response = await got(`${this.getApiUrl()}whoami`, {
      responseType: 'json',
      headers: this.getHeaders(),
    });

    if (response.statusCode === 200) {
      return response.body;
    }
    throw new WiaExceptions.HTTPBadRequestError(response.statusCode, response.body);
  }

  _prepResources() {
    // eslint-disable-next-line guard-for-in
    for (const name in resources) {
      this[
        name[0].toLowerCase() + name.substring(1)
      ] = new resources[name](this);
    }
  }

  _prepStream() {
    this.stream = new WiaStream(this);
  }
}

module.exports = Wia;
