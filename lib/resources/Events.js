const got = require('got');
const WiaExceptions = require('../WiaExceptions');
const helper = require('./helper');

/**
 * @typedef {Object} Event
 * @property {string} id - Unique identifier of the event.
 * @property {number} name - Name of the event.
 * @property {any} data - Data of the event.
 * @property {number} createdAt - Timestamp (in ms) of when event was created.
 * @property {number} updatedAt - Timestamp (in ms) of when event was last updated.
 */

/**
 * @typedef {Object} EventList
 * @property {Event[]} events - Array of events.
 * @property {number} count - Total count of events that match query.
 */
class WiaResourceEvents {
  constructor(parent) {
    this.parent = parent;
  }

  /**
   * Creates an event.
   * @param {Object} opt - The event to be created.
   * @param {string} opt.name - The name of the event.
   * @param {string} opt.data - The data of the event.
   * @returns {Event}
   */
  async create(opt) {
    if (!opt) {
      throw new WiaExceptions.HTTPBadRequestError('Options cannot be null');
    }

    let response = null;
    try {
      response = await got.post(`${this.parent.getApiUrl()}events`, {
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
   * Retrieves an event.
   * @param {string} id - The id of the event
   * @returns {Event}
   */
  async retrieve(id) {
    let response = null;
    try {
      response = await got.get(`${this.parent.getApiUrl()}events/${id}`, {
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
   * Lists events.
   * @param {Object} opt - The query parameters.
   * @returns {EventList}
   */
  async list(opt) {
    let response = null;
    try {
      response = await got.get(`${this.parent.getApiUrl()}events`, {
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
}

module.exports = WiaResourceEvents;
