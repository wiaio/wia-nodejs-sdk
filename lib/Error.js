'use strict';

function WiaRequestException(statusCode, message) {
   this.statusCode = statusCode;
   this.message = message;
   this.toString = function() {
      return this.statusCode + " : " + this.message;
   };
}

module.exports = {
  WiaRequestException: WiaRequestException
}
