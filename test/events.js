const { expect } = require('chai');
const randomstring = require('randomstring');
const testUtils = require('./testUtils');
const Wia = require('../wia');

describe('Event', () => {
  before((done) => {
    done();
  });

  describe('#createAnEvent', () => {
    it('should create an event', async () => {
      try {
        const wia = new Wia(testUtils.getDeviceSecretKey());
        const createdEvent = await wia.events.create({
          name: randomstring.generate(16),
          data: 21.5,
        });

        expect(createdEvent).to.exist;
        expect(createdEvent.id).to.exist;
      } catch (e) {
        console.log(e);
        expect(e).to.not.exist;
      }
    });
  });

  describe('#createAnEventObject', () => {
    it('should create an event with object', async () => {
      try {
        const wia = new Wia(testUtils.getDeviceSecretKey());
        const createdEvent = await wia.events.create({
          name: randomstring.generate(16),
          data: {
            temperature: 123,
            humidity: 456.789,
          },
        });

        expect(createdEvent).to.exist;
        expect(createdEvent.id).to.exist;
      } catch (e) {
        console.log(e);
        expect(e).to.not.exist;
      }
    });
  });

  describe('#createAnEventString', () => {
    it('should create an event with string', async () => {
      try {
        const wia = new Wia(testUtils.getDeviceSecretKey());
        const createdEvent = await wia.events.create({
          name: randomstring.generate(16),
          data: 'sometextgoeshere',
        });

        expect(createdEvent).to.exist;
        expect(createdEvent.id).to.exist;
      } catch (e) {
        console.log(e);
        expect(e).to.not.exist;
      }
    });
  });

  describe('#createRetrieveAnEvent', () => {
    it('should create and retrieve an event', async () => {
      try {
        const wiaDevice = new Wia(testUtils.getDeviceSecretKey());
        const eventToCreate = {
          name: randomstring.generate(16),
          data: 21.5,
        };
        const createdEvent = await wiaDevice.events.create(eventToCreate);

        expect(createdEvent).to.exist;
        expect(createdEvent.id).to.exist;

        const wiaOrg = new Wia(testUtils.getOrganisationSecretKey());
        const retrievedEvent = await wiaOrg.events.retrieve(createdEvent.id);

        expect(retrievedEvent).to.exist;
        expect(retrievedEvent.id).to.exist;
        expect(retrievedEvent.id).to.equal(createdEvent.id);
        expect(retrievedEvent.data).to.equal(eventToCreate.data);
      } catch (e) {
        console.log(e);
        expect(e).to.not.exist;
      }
    });
  });

  describe('#retrieveEventListForADevice', () => {
    it('should retrieve a list of events for a device', async () => {
      try {
        const wia = new Wia(testUtils.getOrganisationSecretKey());
        const result = await wia.events.list({
          device: {
            id: testUtils.getDeviceId(),
          },
        });

        expect(result).to.exist;

        result.events.forEach((event) => {
          expect(event.id).to.exist;
          expect(event.name).to.exist;
          expect(event.data).to.exist;
        });

        expect(result.count).to.exist;

        console.log(`Retrieved ${result.count} events for device.`);
      } catch (e) {
        console.log(e);
        expect(e).to.not.exist;
      }
    });
  });

  // describe('#retrieveMinimumEventForADevice', () => {
  //   it('should retrieves the minimum event for a device', async () => {
  //     try {
  //       const wia = new Wia(testUtils.getOrganisationSecretKey());
  //       const result = await wia.events.list({
  //         device: {
  //           id: testUtils.getDeviceId(),
  //         },
  //         name: 'temperature',
  //         order: 'data',
  //         sort: 'asc',
  //         limit: 1,
  //       });

  //       expect(result).to.exist;

  //       result.events.forEach((event) => {
  //         expect(event.id).to.exist;
  //         expect(event.name).to.exist;
  //         expect(event.data).to.exist;
  //       });

  //       expect(result.count).to.exist;

  //       console.log(`Retrieved ${result.count} events for device.`);
  //     } catch (e) {
  //       console.log(e);
  //       expect(e).to.not.exist;
  //     }
  //   });
  // });

  after((done) => {
    done();
  });
});
