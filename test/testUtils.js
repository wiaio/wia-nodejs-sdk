module.exports = {
  getUserAccessToken() {
    const key = process.env.USER_ACCESS_TOKEN;
    return key;
  },
  getUserUsername() {
    const key = process.env.USER_USERNAME;
    return key;
  },
  getUserPassword() {
    const key = process.env.USER_PASSWORD;
    return key;
  },
  getDeviceId() {
    const key = process.env.DEVICE_ID;
    return key;
  },
  getDeviceSecretKey() {
    const key = process.env.DEVICE_SECRET_KEY;
    return key;
  },
  getOrganisationSecretKey() {
    const key = process.env.ORGANISATION_SECRET_KEY;
    return key;
  },
  getAppKey() {
    const key = process.env.WIA_TEST_APP_KEY;
    return key;
  },
  getSpaceId() {
    const key = process.env.SPACE_ID;
    return key;
  },
  getStreamConfig() {
    return {
      protocol: process.env.STREAM_PROTOCOL || 'mqtts',
      host: process.env.STREAM_HOST || 'mqtt.wia.io',
      port: process.env.STREAM_PORT || 8883,
    };
  },
};
