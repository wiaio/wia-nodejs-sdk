const got = require('got');
const WiaExceptions = require('../WiaExceptions');
const helper = require('./helper');

/**
 * @typedef {Object} Product
 * @property {string} id - Unique identifier of the product.
 * @property {number} name - Name of the product.
 * @property {number} createdAt - Timestamp (in ms) of when product was created.
 * @property {number} updatedAt - Timestamp (in ms) of when product was last updated.
 */

/**
 * @typedef {Object} ProductList
 * @property {Product[]} products - Array of products.
 * @property {number} count - Total count of products that match query.
 */

class WiaResourceProducts {
  constructor(parent) {
    this.parent = parent;
  }

  /**
   * Retrieves a product.
   * @param {Object|string} opt - The product to be retrieved.
   * @param {string} opt.id - The id of the space.
   * @returns {Product}
   */
  async retrieve(opt) {
    if (!opt) {
      throw new WiaExceptions.HTTPBadRequestError('Options cannot be null');
    }

    let productId = null;
    if (typeof opt === 'string') {
      productId = opt;
    } else if (typeof opt === 'object' && opt?.id) {
      productId = opt.id;
    }

    let response = null;
    try {
      response = await got.get(`${this.parent.getApiUrl()}products/${productId}`, {
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
   * Updates a product.
   * @param {string} id - The id of the product.
   * @param {Object} opt - The parameters to update.
   * @param {string} opt.name - The name of the product.
   * @returns {Product}
   */
  async update(id, opt) {
    if (!opt) {
      throw new WiaExceptions.HTTPBadRequestError('Options cannot be null');
    }

    let response = null;
    try {
      response = await got.put(`${this.parent.getApiUrl()}products/${id}`, {
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
   * Lists products.
   * @param {Object} opt - The query parameters.
   * @param {Object} product - The product to return events for.
   * @param {string} id - The ID of the product.
   * @param {string} name - The name of the event.
   * @returns {ProductList}
   */
  async list(opt) {
    let response = null;
    try {
      response = await got.get(`${this.parent.getApiUrl()}products`, {
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

module.exports = WiaResourceProducts;
