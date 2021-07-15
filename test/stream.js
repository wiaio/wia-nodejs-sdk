// const { expect } = require('chai');
// const testUtils = require('./testUtils');
// const wia = require('../wia')({
//   accessToken: testUtils.getDeviceSecretKey(),
//   stream: testUtils.getStreamConfig(),
// });

// describe('Stream', () => {
//   before((done) => {
//     done();
//   });

//   beforeEach((done) => {
//     wia.stream.disconnect();
//     setTimeout(() => {
//       done();
//     }, 150);
//   });

//   describe('#connectToStream', () => {
//     it('should connect to the stream', (done) => {
//       let doneCalled = false;
//       wia.stream.on('connect', () => {
//         if (!doneCalled) {
//           doneCalled = true;
//           done();
//         }
//       });
//       wia.stream.connect();
//     });
//   });

//   describe('#connectAndDisconnectToStream', () => {
//     it('should connect and disconnect to the stream', (done) => {
//       let disconnectCalled = false;

//       wia.stream.on('connect', () => {
//         if (!disconnectCalled) {
//           disconnectCalled = true;
//           wia.stream.disconnect();
//         }
//       });

//       wia.stream.on('disconnect', () => {
//         done();
//       });

//       wia.stream.connect();
//     });
//   });

//   after((done) => {
//     done();
//   });
// });
