Sift Node.js SDK
================

JavaScript wrapper for [Sift API](http://sift.easilydo.com).

Installation
------------

`npm install siftapi --save`

Usage
-----

**ES6/7:**

```javascript
import { SiftAPI } from 'siftapi';

siftapi = new SiftAPI('<API_KEY>', '<API_SECRET>');
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
npm run dev
```

Check out more at the [CONTRIBUTING](https://github.com/agent8/sift-node-sdk/blob/master/docs/CONTRIBUTING.MD) guide.

Documentation
-------------

You can find the docs [here](https://github.com/agent8/sift-node-sdk/blob/master/docs/API.md)
