# Wia SDK for Node.js

## Installing
To install the Wia SDK for Node.js is to use the npm package manager for Node.js. Simply type the following into a terminal window:

```sh
npm install wia
```

## Creating a Device Client

```sh
var Wia = require('wia');
var deviceClient = new Wia.DeviceClient('<DEVICE_TOKEN>');
```

## Publishing Events

<ul>
  <li>name (required) - String - Name of the event</li>
  <li>data (optional) - Object - Data associated with the event</li>
  <li>callback (optional) - Function - Callback after the event has been sent</li>
</ul>

```sh
deviceClient.publishEvent("Sensor", {
    temperature: 14.0
}, function() {
    console.log("In callback!");
});
```

## Creating a User Client

```sh
var Wia = require('wia');
var userClient = new Wia.UserClient('<USER_TOKEN>');
```

### List Devices

```sh
userClient.listDevices({}, function(err, devices) {
  if (err) console.log(err);
	if (devices) console.log(devices);
});
```


## License
This SDK is distributed under the
[Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0),
see LICENSE.txt and NOTICE.txt for more information.
