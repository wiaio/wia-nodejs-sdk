// const request = require('request');
// const WiaExceptions = require('../WiaExceptions');

// function WiaResourceLocations(wia) {
//   this.publish = function (opt, cb) {
//     if (!opt) return cb(new WiaExceptions.HTTPBadRequestError(400, 'Object cannot be null.'));

//     if (!wia.stream || !wia.stream.connected || !wia.clientInfo) {
//       request.post(`${wia.getApiUrl()}locations`, {
//         auth: {
//           bearer: wia.getApiField('accessToken'),
//         },
//         body: opt,
//         json: true,
//         headers: wia.getHeaders(),
//       }, (error, response, body) => {
//         if (cb) {
//           if (error) return cb(error, null);
//           if (response.statusCode == 200 || response.statusCode == 201) cb(null, body);
//           else cb(new WiaExceptions.HTTPBadRequestError(response.statusCode, body || ''), null);
//         }
//       });
//     } else {
//       wia.stream.publish(`devices/${wia.clientInfo.id}/locations`, JSON.stringify(opt), cb);
//     }
//   },
//   this.subscribe = function (opt, cb) {
//     if (!opt) return cb({ message: 'No options specified.' });
//     if (!opt.device) {
//       return cb({ message: 'Device not specified.' }, null);
//     }
//     wia.stream.subscribe(`devices/${opt.device}/locations`, cb);
//   },
//   this.unsubscribe = function (opt, cb) {
//     if (!opt) return cb({ message: 'No options specified.' });
//     if (!opt.device) {
//       return cb({ message: 'Device not specified.' }, null);
//     }
//     wia.stream.unsubscribe(`devices/${opt.device}/locations`, cb);
//   },
//   this.list = function (opt, cb) {
//     request.get(`${wia.getApiUrl()}locations`, {
//       auth: {
//         bearer: wia.getApiField('accessToken'),
//       },
//       qs: opt || {},
//       json: true,
//       headers: wia.getHeaders(),
//     }, (error, response, body) => {
//       if (cb) {
//         if (error) return cb(error, null);
//         if (response.statusCode == 200) cb(null, body);
//         else cb(new WiaExceptions.HTTPBadRequestError(response.statusCode, body || ''), null);
//       }
//     });
//   };
// }

// module.exports = WiaResourceLocations;
