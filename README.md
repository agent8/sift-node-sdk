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
var SiftAPI = require('siftapi');

let siftapi = new SiftAPI.SiftAPI('<API_KEY>', '<API_SECRET>');
```

Testing
-------

Rename `sensitive.example.js` to `sensitive.js` and include your `API_KEY` and
`API_SECRET`.

```
gulp test
```

For automated testing while developing, run

```
gulp watch
```

Documentation
-------------

Work-in-Progress.

