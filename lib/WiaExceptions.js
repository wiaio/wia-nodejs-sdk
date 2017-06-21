'use strict';

module.exports = {
  WiaRequestException: function(status, message) {
    var obj = Object.create(Error.prototype);

    obj.name = 'WiaRequestException';
    obj.message = message || '';

    var error = new Error(obj.message);
    error.name = obj.name;
    obj.stack = error.stack;
    obj.status = status || 500;

    return obj;
  }
}
