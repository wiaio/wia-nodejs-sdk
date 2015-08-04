# Wia SDK for Node.js

## Installing
To install the Wia SDK for Node.js is to use the npm package manager for Node.js. Simply type the following into a terminal window:

```sh
npm install wia-sdk
```

## Creating a Device Client

```sh
var WiaSDK = require('wia-sdk');
var client = new WiaSDK.DeviceClient({
  token: <YOUR_TOKEN_HERE>
});
```

## Publishing Events

```sh
client.publishEvent("Sensor", {
    temperature: 14.0
}, function() {
    console.log("In callback!");
});
```


## License
This SDK is distributed under the
[Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0),
see LICENSE.txt and NOTICE.txt for more information.
