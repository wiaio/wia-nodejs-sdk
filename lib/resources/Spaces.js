const got = require('got');
const WiaExceptions = require('../WiaExceptions');
const helper = require('./helper');

/**
 * @typedef {Object} Space
 * @property {string} id - Unique identifier of the space.
 * @property {number} name - Name of the space.
 * @property {number} createdAt - Timestamp (in ms) of when space was created.
 * @property {number} updatedAt - Timestamp (in ms) of when space was last updated.
 */

/**
 * @typedef {Object} SpaceList
 * @property {Space[]} spaces - Array of spaces.
 * @property {number} count - Total count of spaces that match query.
 */

class WiaResourceSpaces {
  constructor(parent) {
    this.parent = parent;
  }

  /**
   * Retrieves a space.
   * @param {Object|string} opt - The space to be retrieved.
   * @param {string} opt.id - The id of the space.
   * @returns {Space}
   */
  async retrieve(opt) {
    if (!opt) {
      throw new WiaExceptions.HTTPBadRequestError('Options cannot be null');
    }

    let spaceId = null;
    if (typeof opt === 'string') {
      spaceId = opt;
    } else if (typeof opt === 'object' && opt?.id) {
      spaceId = opt.id;
    }

    let response = null;
    try {
      response = await got.get(`${this.parent.getApiUrl()}spaces/${spaceId}`, {
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
   * Lists spaces.
   * @param {Object} opt - The query parameters.
   * @returns {SpaceList}
   */
  async list(opt) {
    let response = null;
    try {
      response = await got.get(`${this.parent.getApiUrl()}spaces`, {
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

module.exports = WiaResourceSpaces;
