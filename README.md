# Ether Ads Market

## `Production`

#### you can run an auction demo on any website by injecting the following JS snippet:

```js
(function() {
  window["EAM_SELECTOR"] = "body";
  var s = document.createElement("script");
  s.src = "https://ether-ads-market.herokuapp.com/video-loader.js";
  document.body.appendChild(s);
})();
```

1. open the browser.
2. open the browser Developer-Tools (press on the F12 key).
3. go to the "console" tab.
4. insert the above JS snippet and then press the Enter key.

#### you can simulate manual auctions by using the production server api:

https://ether-ads-market.herokuapp.com/api/v1

## `Development`

```
$ git clone git@github.com:talsi2/ether-ads-market.git ether-ads-market
$ cd ./ether-ads-market
$ npm install
$ npm run compile-contracts
$ npm run ethereum
$ npm start
```

development snippet:

```js
(function() {
  window["EAM_SELECTOR"] = "div p, body";
  window["EAM_ENDPOINT"] = "http://localhost:3000";
  var s = document.createElement("script");
  s.src = "http://localhost:3000/video-loader.js";
  document.body.appendChild(s);
})();
```

## `Scripts`

#### `$ npm run ethereum`

Initializes the local ethereum network.

#### `$ npm run compile-contracts`

Builds the contracts.

#### `$ npm start`

Starts the app server in development mode on [http://localhost:3000](http://localhost:3000).

#### `$ npm test`

Runs the integration tests.
