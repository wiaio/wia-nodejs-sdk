// 'use strict';
//
// var expect = require('chai').expect;
// var testUtils = require('./testUtils');
// var Wia = require('../wia');
// var wia = new Wia({
//     appKey: testUtils.getAppKey()
// });
// describe('Space', function () {
//     before(function (done) {
//         wia.generateAccessToken({
//             "username": testUtils.getUserUsername(),
//             "password": testUtils.getUserPassword(),
//             "scope": "user",
//             "grantType": "password"
//         }, function (error, body) {
//             expect(error).not.to.exist;
//             expect(body).to.exist;
//             expect(body['token']).to.exist;
//             wia.setAccessToken(body['token']);
//             done();
//         });
//
//     });
//
//     // describe('#CreateAnAccessToken', function () {
//     //     it('should generate an access token using a app key', function (done) {
//     //         this.wia = new Wia({
//     //             appKey: testUtils.getAppKey()
//     //         });
//     //         this.wia.generateAccessToken({
//     //             "username": testUtils.getUserUsername(),
//     //             "password": testUtils.getUserPassword(),
//     //             "scope": "user",
//     //             "grantType": "password"
//     //         }, function (error, body) {
//     //             expect(error).not.to.exist;
//     //             expect(body).to.exist;
//     //             expect(body['token']).to.exist;
//     //             this.wia.setAccessToken(body['token']);
//     //         });
//     //     });
//     // });
//
//     describe('#createRetrieveASpace', function () {
//         it('should create/retrieve a space using app key', function (done) {
//             var spaceName = "Space " + new Date().getTime();
//             wia.spaces.create({
//                 name: spaceName
//             }, function (error, space) {
//                 expect(error).to.not.exist;
//                 expect(space).to.exist;
//
//                 wia.spaces.retrieve({
//                     id: space.id
//                 }, function (error, space) {
//                     expect(error).to.not.exist;
//                     expect(space).to.exist;
//                     done();
//                 });
//             });
//         });
//     });
//     describe('#listASpace', function () {
//         it('should list spaces', function (done) {
//             wia.spaces.list({}, function (error, spaces) {
//                 expect(error).to.not.exist;
//                 expect(spaces).to.exist;
//                 expect(spaces.count).to.be.a('number');
//                 expect(spaces.spaces).to.be.an('array');
//                 done();
//             });
//         });
//     });
//
//     after(function (done) {
//         done();
//     });
// });
