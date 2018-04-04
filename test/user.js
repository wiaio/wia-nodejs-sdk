// 'use strict';
//
// var expect = require('chai').expect;
// var testUtils = require('./testUtils');
// var Wia = require('../wia');
//
// describe('User', function () {
//   before(function (done) {
//       done();
//   });
//
//   describe('#createInstanceOfWiaBadUserSecretKey', function () {
//     it('should create an instance of wia using a bad user secret key', function (done) {
//       var wiaUser = new Wia("usr_sk_abc123");
//       wiaUser.whoami(function(error, data) {
//         expect(error).to.exist;
//         expect(data).to.not.exist;
//         done();
//       });
//     });
//   });
//
//   describe('#generateUserAccessToken', function () {
//     it('should generate an access token for a user', function (done) {
//       var wia = new Wia({
//             appKey: testUtils.getAppKey()
//       });
//       wia.generateAccessToken({
//         username: testUtils.getUserUsername(),
//         password: testUtils.getUserPassword(),
//         scope: "user",
//         grantType: "password"
//       }, function(error, data) {
//         expect(error).to.not.exist;
//         expect(data).to.exist;
//         expect(data.token).to.exist;
//         expect(data.refreshToken).to.exist;
//         expect(data.expiresIn).to.exist;
//         expect(data.scope).to.exist;
//         done();
//       });
//     });
//   });
//
//   describe('#failToGenerateAccessTokenForInvalidCredentials', function () {
//     it('should fail to generate an access token for a user with invalid credentials', function (done) {
//       var wia = new Wia();
//       wia.generateAccessToken({
//         username: "idonotexistever@wia.io",
//         password: "password",
//         scope: "user",
//         grantType: "password"
//       }, function(error, data) {
//         expect(error).to.exist;
//         expect(data).to.not.exist;
//         done();
//       });
//     });
//   });
//
//   after(function (done) {
//       done();
//   });
// });
