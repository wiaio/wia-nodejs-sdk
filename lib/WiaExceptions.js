function HTTPRequestError(status, message) {
  const obj = Object.create(Error.prototype);

  obj.name = 'HTTPRequestError';
  obj.message = message || '';

  const error = new Error(obj.message);
  error.name = obj.name;
  obj.stack = error.stack;
  obj.status = status || 500;
  obj.statusCode = status || 500;
  obj.error = true;

  return obj;
}

module.exports = {
  /**
  * Instantiate WiaRequestError with an object
  * @name WiaRequestError
  * @constructor
  * @param {String} status The message.
  * @param {string} message The message.
  */
  WiaRequestError(status, message) {
    const obj = Object.create(Error.prototype);

    obj.name = 'WiaRequestError';
    obj.message = message || '';

    const error = new Error(obj.message);
    error.name = obj.name;
    obj.stack = error.stack;
    obj.status = status || 500;
    obj.statusCode = status || 500;
    obj.error = true;

    return obj;
  },
  /**
  * Instantiate BadRequestError with an object
  * @name BadRequestError
  * @constructor
  * @param {String} message The message.
  */
  BadRequestError: class BadRequestError extends Error {
    constructor(message) {
      super();
      this.name = 'BadRequestError';
      this.message = message;
      this.status = 400;
      this.statusCode = 400;
      this.error = true;
    }

    toJSON() {
      return {
        message: this.message,
      };
    }
  },
  /**
  * Instantiate ValidationError with an object
  * @name ValidationError
  * @constructor
  * @param {String} message The message.
  */
  ValidationError: class ValidationError extends Error {
    constructor(message) {
      super();
      this.name = 'ValidationError';
      this.message = message;
      this.fields = [];
      this.status = 400;
      this.statusCode = 400;
      this.error = true;
    }

    toJSON() {
      return {
        message: this.message,
        fields: this.fields,
      };
    }
  },
  /**
  * Instantiate UnauthorizedError with an object
  * @name UnauthorizedError
  * @constructor
  * @param {String} message The message.
  */
  UnauthorizedError: class UnauthorizedError extends Error {
    constructor(message) {
      super();
      this.name = 'UnauthorizedError';
      this.message = message;
      this.status = 401;
      this.statusCode = 401;
      this.error = true;
    }

    toJSON() {
      return {
        message: this.message,
      };
    }
  },
  /**
  * Instantiate ForbiddenError with an object
  * @name ForbiddenError
  * @constructor
  * @param {String} message The message.
  */
  ForbiddenError: class ForbiddenError extends Error {
    constructor(message) {
      super();
      this.name = 'ForbiddenError';
      this.message = message;
      this.status = 403;
      this.statusCode = 403;
      this.error = true;
    }

    toJSON() {
      return {
        message: this.message,
      };
    }
  },
  /**
  * Instantiate NotFoundError with an object
  * @name NotFoundError
  * @constructor
  * @param {String} message The message.
  */
  NotFoundError: class NotFoundError extends Error {
    constructor(message) {
      super();
      this.name = 'NotFoundError';
      this.message = message;
      this.status = 404;
      this.statusCode = 404;
      this.error = true;
    }

    toJSON() {
      return {
        message: this.message,
      };
    }
  },
  /**
  * Instantiate ConflictError with an object
  * @name ConflictError
  * @constructor
  * @param {String} message The message.
  */
  ConflictError: class ConflictError extends Error {
    constructor(message) {
      super();
      this.name = 'ConflictError';
      this.message = message;
      this.status = 409;
      this.statusCode = 409;
      this.error = true;
    }

    toJSON() {
      return {
        message: this.message,
      };
    }
  },
  /**
  * Instantiate ServerError with an object
  * @name ServerError
  * @constructor
  * @param {String} message The message.
  */
  ServerError: class ServerError extends Error {
    constructor(message) {
      super();
      this.name = 'ServerError';
      this.message = message;
      this.status = 500;
      this.statusCode = 500;
      this.error = true;
    }

    toJSON() {
      return {
        message: this.message,
      };
    }
  },
  /**
  * Instantiate GenericError with an object
  * @name GenericError
  * @constructor
  * @param {String} message The message.
  */
  GenericError: class GenericError extends Error {
    constructor(message) {
      super();
      this.name = 'GenericError';
      this.message = message;
      this.status = 500;
      this.statusCode = 500;
      this.error = true;
    }

    toJSON() {
      return {
        message: this.message,
      };
    }
  },
  HTTPRequestError,
  HTTPBadRequestError: class HTTPBadRequestError extends HTTPRequestError {
    constructor(message) {
      super();
      this.name = 'HTTPBadRequestError';
      this.message = message || 'Bad Request.';
      this.status = 400;
      this.statusCode = 400;
      this.error = true;
    }
  },
  HTTPUnauthorizedError: class HTTPUnauthorizedError extends HTTPRequestError {
    constructor(message) {
      super();
      this.name = 'HTTPUnauthorizedError';
      this.message = message || 'Unauthorized.';
      this.status = 401;
      this.statusCode = 401;
      this.error = true;
    }
  },
  HTTPForbiddenError: class HTTPForbiddenError extends HTTPRequestError {
    constructor(message) {
      super();
      this.name = 'HTTPForbiddenError';
      this.message = message || 'Forbidden.';
      this.status = 403;
      this.statusCode = 403;
      this.error = true;
    }
  },
  HTTPNotFoundError: class HTTPNotFoundError extends HTTPRequestError {
    constructor(message) {
      super();
      this.name = 'HTTPNotFoundError';
      this.message = message || 'Not Found.';
      this.status = 404;
      this.statusCode = 404;
      this.error = true;
    }
  },
  HTTPConflictError: class HTTPConflictError extends HTTPRequestError {
    constructor(message) {
      super();
      this.name = 'HTTPConflictError';
      this.message = message || 'Conflict.';
      this.status = 409;
      this.statusCode = 409;
      this.error = true;
    }
  },
  HTTPGoneError: class HTTPGoneError extends HTTPRequestError {
    constructor(message) {
      super();
      this.name = 'HTTPGoneError';
      this.message = message || 'Gone.';
      this.status = 410;
      this.statusCode = 410;
      this.error = true;
    }
  },
  HTTPTeapotError: class HTTPTeapotError extends HTTPRequestError {
    constructor(message) {
      super();
      this.name = 'HTTPTeapotError';
      this.message = message || 'Teapot.';
      this.status = 418;
      this.statusCode = 418;
      this.error = true;
    }
  },
  HTTPTooManyRequests: class HTTPTooManyRequests extends HTTPRequestError {
    constructor(message) {
      super();
      this.name = 'HTTPTooManyRequests';
      this.message = message || 'Too Many Requests.';
      this.status = 429;
      this.statusCode = 429;
      this.error = true;
    }
  },
  HTTPInternalServerError: class HTTPInternalServerError extends HTTPRequestError {
    constructor(message) {
      super();
      this.name = 'HTTPInternalServerError';
      this.message = message || 'Internal Server Error.';
      this.status = 500;
      this.statusCode = 500;
      this.error = true;
    }
  },
  returnErrorJSON(err) {
    if (err.toJSON) {
      return err.toJSON();
    }

    return {
      message: err.toString(),
    };
  },
};
