Sift Node.js SDK
================

A Node.js wrapper around [Sift API](http://sift.easilydo.com) written in ES6/7,
and compiled with Babel.

Installation
------------

`npm install siftapi --save`
(Work-in-progress, package not uploaded yet)

Usage
-----

**ES6/7:**

```javascript
import { SiftAPI } from 'siftapi';

siftapi = new SiftAPI('<API_KEY>', '<API_SECRET>');
```

**ES5:**

```javascript
var SiftAPI = require('siftapi').default;

let siftapi = new SiftAPI('<API_KEY>', '<API_SECRET>');
```

To see more sample usage, either refer to the [docs](https://github.com/agent8
/sift-node-sdk/blob/master/docs/API.md) or see the test specs.

Development
-----------

Rename `sensitive.js.example` to `sensitive.js` and include your `API_KEY` and
`API_SECRET`.

Rename `test-config.js.example` to `test-config.js` and include your email
account name and refresh token for the test suite to work.

```
npm install
gulp watch
```

The test suite will be run
automatically when a write action is performed on the code.

Check out more at the [CONTRIBUTING](https://github.com/agent8/sift-node-sdk/blob/master/docs/CONTRIBUTING.MD) guide.

To run the test suite only:
`gulp test`

Documentation
-------------

You can find the docs [here](https://github.com/agent8/sift-node-sdk/blob/master/docs/API.md)
