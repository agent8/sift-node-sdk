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

siftapi = new SiftAPI.SiftAPI('<API_KEY>', '<API_SECRET>');
```

Testing
-------

```javascript
gulp test
```

Documentation
-------------

Work-in-Progress.

