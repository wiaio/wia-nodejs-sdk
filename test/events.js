// const { expect } = require('chai');
// const fs = require('fs');
// const testUtils = require('./testUtils');
// const Wia = require('../wia');

// const wia = new Wia({
//   secretKey: testUtils.getDeviceSecretKey(),
// });

// describe('Wia', () => {
//   before((done) => {
//     done();
//   });

//   describe('#publishAnEvent', () => {
//     it('should publish an event', (done) => {
//       wia.events.publish({
//         name: 'temperature',
//         data: 21.4564,
//       }, (err, result) => {
//         if (err) {
//           console.log(err);
//           return;
//         }

//         expect(result).to.exist;
//         expect(result.id).to.exist;
//         done();
//       });
//     });
//   });

//   describe('#publishAnEventWithFile', () => {
//     it('should publish an event with a file', (done) => {
//       wia.events.publish({
//         name: 'photo',
//         file: fs.createReadStream(`${__dirname}/balfie.png`),
//       }, (err, result) => {
//         if (err) {
//           console.log(err);
//           return;
//         }

//         expect(result).to.exist;
//         expect(result.id).to.exist;
//         done();
//       });
//     });
//   });

//   describe('#publishALocation', () => {
//     it('should publish a location', (done) => {
//       wia.locations.publish({
//         latitude: 35.652832,
//         longitude: 139.839478,
//       }, (err, result) => {
//         if (err) {
//           console.log(err);
//           return;
//         }

//         expect(result).to.exist;
//         expect(result.id).to.exist;
//         done();
//       });
//     });
//   });

//   after((done) => {
//     done();
//   });
// });
