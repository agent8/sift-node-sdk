'use strict';

/* global it, describe, before, after */

import {expect} from 'chai';

import { sortObj, buildUrl } from '../dist/utils.js';

describe('Utils - sortObj test', () => {
  it('should sort an object by it\'s key', () => {
    const inpt = {
      'b': 2,
      'a': 1,
      'c': 3
    };
    const output = {
      'a': 1,
      'b': 2,
      'c': 3
    };
    expect(sortObj(inpt)).to.be.deep.equal(output);
  });
});

describe('Utils - buildUrl test', () => {
  it('should build the correct url', () => {
    const url = 'http://api.easilydo.com/v1';
    const path = '/users/test/sifts';

    const output = 'http://api.easilydo.com/v1/users/test/sifts';

    expect(buildUrl(url, path)).to.be.equal(output);
  });
});

