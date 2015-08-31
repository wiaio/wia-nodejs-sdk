# Wia SDK for Node.js

## Installing
To install the Wia SDK for Node.js is to use the npm package manager for Node.js. Simply type the following into a terminal window:

```sh
npm install wia
```

## Device Client

### Constructor

```sh
var Wia = require('wia');
var deviceClient = new Wia.DeviceClient('<DEVICE_TOKEN>', {});
```

### Publishing Events

<ul>
  <li>name (required) - String - Name of the event.</li>
  <li>data (required) - Object - Data associated with the event.</li>
  <li>callback (optional) - Function - Callback after the event has been sent.</li>
</ul>

```sh
deviceClient.publishEvent("Sensor", {
    temperature: 14.0
}, function() {
    console.log("In callback!");
});
```

### Get Current Device

```sh
deviceClient.getMe(function(err, device) {
	if (err) console.log(err);
	if (device) console.log(device);
});
```

### Send a Ping

```sh
deviceClient.sendPing(function(err, device) {
	if (err) console.log(err);
	else console.log("Ping sent!");
});
```

## User Client

### Constructor

```sh
var Wia = require('wia');
var userClient = new Wia.UserClient('<USER_TOKEN>', {});
```

### List Devices

```sh
userClient.listDevices({}, function(err, devices) {
	if (err) console.log(err);
	if (devices) console.log(devices);
});
```

### Get a Device

```sh
userClient.getDevice('<DEVICE_KEY>', function(err, device) {
	if (err) console.log(err);
	if (device) console.log(device);
});
```

### List Device Event

```sh
userClient.listDeviceEvents('<DEVICE_KEY>', function(err, events) {
	if (err) console.log(err);
	if (events) console.log(events);
});
```

### Subscribe to Device Events

```sh
userClient.subscribeToDeviceEvents('<DEVICE_KEY>', function(err, event) {
	if (err) console.log(err);
	if (events) console.log(event);
});
```

### Unsubscribe from Device Events

```sh
userClient.unsubscribeToDeviceEvents('<DEVICE_KEY>', function(err) {
	if (err) console.log(err);
});
```

## License
This SDK is distributed under the the MIT License

Copyright (c) 2010-2015 Wia Limited. http://wia.io

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
