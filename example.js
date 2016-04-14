'use strict';

import fs from 'fs';
import SiftAPI from './dist/siftapi';

// Fill in with your own API key and secret
let sift = new SiftAPI('', '');

sift.addUser('test', 'en_US')
  .then(body => {
    console.log(body);
  });

/**
 * Remember to include your own test eml file in the same directory as
 * example.js
 */
fs.readFile('test.eml', 'utf8', (err, eml) => {
  if(err) {
    return console.log(err);
  }

  sift.discovery('test', eml.toString())
    .then(body => {
      console.log(body);
    })
    .catch(err => {
      return console.log('err');
    });
});

sift.getSifts('test')
  .then(body => {
    console.log(body);
  });

sift.postFeedback('test', 'en_US', 'America/Los_Angeles')
  .then(body => {
    console.log(body);
  });

sift.deleteUser('test')
  .then(body => {
    console.log(body);
  });

