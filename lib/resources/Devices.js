const got = require('got');
const WiaExceptions = require('../WiaExceptions');
const helper = require('./helper');

/**
 * @typedef {Object} Device
 * @property {string} id - Unique identifier of the device.
 * @property {number} name - Name of the device.
 * @property {number} createdAt - Timestamp (in ms) of when device was created.
 * @property {number} updatedAt - Timestamp (in ms) of when device was last updated.
 */

/**
 * @typedef {Object} DeviceList
 * @property {Device[]} devices - Array of devices.
 * @property {number} count - Total count of devices that match query.
 */

/**
 * @typedef {Object} DeletedResponse
 * @property {boolean} deleted - True when a device has been deleted.
 */
class WiaResourceDevices {
  constructor(parent) {
    this.parent = parent;
  }

  /**
   * Creates a device.
   * @param {Object} opt - The device to be created.
   * @param {string} opt.name - The name of the device.
   * @param {Object} opt.space - The space to add the device to.
   * @param {string} opt.space.id - The id of the space.
   * @returns {Device}
   */
  async create(opt) {
    if (!opt) {
      throw new WiaExceptions.HTTPBadRequestError('Options cannot be null');
    }

    let response = null;
    try {
      response = await got.post(`${this.parent.getApiUrl()}devices`, {
        json: opt,
        responseType: 'json',
        headers: this.parent.getHeaders(),
      });
    } catch (error) {
      throw new WiaExceptions.HTTPBadRequestError(error.response.body);
    }

    if (response.statusCode === 200 || response.statusCode === 201) {
      return response.body;
    }

    throw new WiaExceptions.GenericError('Could not process request.');
  }

  /**
   * Retrieves a device.
   * @param {Object|string} opt - The device to be retrieved.
   * @param {string} opt.id - The id of the space.
   * @returns {Device}
   */
  async retrieve(opt) {
    if (!opt) {
      throw new WiaExceptions.HTTPBadRequestError('Options cannot be null');
    }

    let deviceId = null;
    if (typeof opt === 'string') {
      deviceId = opt;
    } else if (typeof opt === 'object' && opt?.id) {
      deviceId = opt.id;
    }

    let response = null;
    try {
      response = await got.get(`${this.parent.getApiUrl()}devices/${deviceId}`, {
        responseType: 'json',
        headers: this.parent.getHeaders(),
      });
    } catch (error) {
      throw new WiaExceptions.HTTPBadRequestError(error.response.body);
    }

    if (response.statusCode === 200) {
      return response.body;
    }

    throw new WiaExceptions.GenericError('Could not process request.');
  }

  /**
   * Updates a device.
   * @param {string} id - The id of the device.
   * @param {Object} opt - The parameters to update.
   * @param {string} opt.name - The name of the device.
   * @returns {Device}
   */
  async update(id, opt) {
    if (!opt) {
      throw new WiaExceptions.HTTPBadRequestError('Options cannot be null');
    }

    let response = null;
    try {
      response = await got.put(`${this.parent.getApiUrl()}devices/${id}`, {
        json: opt,
        responseType: 'json',
        headers: this.parent.getHeaders(),
      });
    } catch (error) {
      throw new WiaExceptions.HTTPBadRequestError(error.response.body);
    }

    if (response.statusCode === 200) {
      return response.body;
    }

    throw new WiaExceptions.GenericError('Could not process request.');
  }

  /**
   * Deletes a device.
   * @param {string} id - The id of the device.
   * @returns {DeletedResponse}
   */
  async delete(id) {
    let response = null;
    try {
      response = await got.delete(`${this.parent.getApiUrl()}devices/${id}`, {
        responseType: 'json',
        headers: this.parent.getHeaders(),
      });
    } catch (error) {
      throw new WiaExceptions.HTTPBadRequestError(error.response.body);
    }

    if (response.statusCode === 200) {
      return response.body;
    }

    throw new WiaExceptions.HTTPBadRequestError(response.statusCode, response.body);
  }

  /**
   * Lists devices.
   * @param {Object} opt - The query parameters.
   * @param {Object} device - The device to return events for.
   * @param {string} id - The ID of the device.
   * @param {string} name - The name of the event.
   * @returns {DeviceList}
   */
  async list(opt) {
    let response = null;
    try {
      response = await got.get(`${this.parent.getApiUrl()}devices`, {
        searchParams: opt ? helper.flattenObj(opt) : {},
        responseType: 'json',
        headers: this.parent.getHeaders(),
      });
    } catch (error) {
      throw new WiaExceptions.HTTPBadRequestError(error.response.body);
    }

    if (response && response.statusCode === 200) {
      return response.body;
    }

    throw new WiaExceptions.GenericError('Could not process request.');
  }

  /**
   * Subscribe to a device via stream.
   * @param {Object} opt - The query parameters.
   * @param {string} opt.id - The ID of the device.
   */
  async subscribe(opt, cb) {
    if (!opt) {
      throw new WiaExceptions.ValidationError('opt is required.');
    }
    if (typeof opt === 'object') {
      if (!opt.id) {
        throw new WiaExceptions.ValidationError('ID not specified.');
      }
      this.parent.stream.subscribe(`devices/${opt.id}/#`, cb);
    } else {
      this.parent.stream.subscribe(`devices/${opt}/#`, cb);
    }
  }

  /**
   * Unsubscribe from a device via stream.
   * @param {Object} opt - The query parameters.
   * @param {string} opt.id - The ID of the device.
   */
  async unsubscribe(opt, cb) {
    if (!opt) {
      throw new WiaExceptions.ValidationError('opt is required.');
    }
    if (typeof opt === 'object') {
      if (!opt.id) {
        throw new WiaExceptions.ValidationError('id is required.');
      }
      this.parent.stream.unsubscribe(`devices/${opt.id}/#`, cb);
    } else {
      this.parent.stream.unsubscribe(`devices/${opt}/#`, cb);
    }
  }
}

module.exports = WiaResourceDevices;
