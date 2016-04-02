'use strict';

/* global it, describe, before, after */

import {expect} from 'chai';

import SiftAPI from '../dist/siftapi.js';
import { API_KEY, API_SECRET } from '../sensitive';

describe('SiftAPI - initialization tests', () => {

  let siftapi;

  beforeEach(() => {
    siftapi = new SiftAPI(API_KEY, API_SECRET);
  });

  it('should be a SiftAPI object', () => {
    expect(siftapi.constructor.name).to.be.equal('SiftAPI');
  });

  it('should contain the correct credentials', () => {
    expect(siftapi.apiKey).to.be.equal(API_KEY);
    expect(siftapi.apiSecret).to.be.equal(API_SECRET);
  });
});

describe('SiftAPI - generateSignature tests', () => {
  let siftapi;

  beforeEach(() => {
    // Initialize with dummy API and Secret to test signature generation
    siftapi = new SiftAPI('abc', '123');
  });

  it('should generate the correct signature', () => {
    const path = '/users/test/sifts';
    const time = 1459546790;
    const params = siftapi._generateParams(time);

    const inpt = siftapi._generateSignature('get', path, params)
    const output = '7ebea0370e02ac6483d95e309d25acd6c327d7f0';
    expect(inpt).to.be.equal(output);
  });

});

