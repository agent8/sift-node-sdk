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
    siftapi = new SiftAPI('123', '123');
  });

  it('should generate the correct signature', () => {
    const path = '/users/test/sifts';
    const time = 1459876773;
    const params = {
      ...siftapi._generateParams(time)
    };
    const data = {};
    const inpt = siftapi._generateSignature('GET', path, params, data);
    const output = 'cc8da705abfde50a68cf95a65410cd7c77135bf6';
    expect(inpt).to.be.equal(output);
  });

});

describe('SiftAPI - _request tests', () => {
  let siftapi;

  beforeEach(() => {
    siftapi = new SiftAPI(API_KEY, API_SECRET);
  });

  it('should make a request with the correct params', (done) => {
    const path = '/users/test/sifts';
    siftapi._request('GET', path)
      .then(body => {
        expect(body.code).to.be.equal(200);
        done();
      })
      .catch(err => {
        expect(err).to.be.throw;
        done();
      });
  });
});

describe('SiftAPI - API endpoint tests', () => {
  let siftapi;

  beforeEach(() => {
    siftapi = new SiftAPI(API_KEY, API_SECRET);
  });

  it('should create a new user', done => {
    siftapi.addUser('test', 'en_US')
      .then(body => {
        expect(body.message).to.be.equal('success');
        expect(body.code).to.be.equal(200);
        expect(body.result.username).to.be.equal('test');
        done();
      }, err => {
        console.log('Error!');
        console.log(err);
      });
  });

  it('should get list of email connections', done => {
    siftapi.getEmailConnections('test')
      .then(body => {
        expect(body.code).to.be.equal(200);
        done();
      }, err => {
        console.log('Error!');
        console.log(err);
      });
  });

  it('should get list of sifts', done => {
    siftapi.getSifts('test')
      .then(body => {
        expect(body.code).to.be.equal(200);
        done();
      }, err => {
        console.log('Error!');
        console.log(err);
      });
  });

  it('should delete a user', done => {
    siftapi.deleteUser('test')
      .then(body => {
        expect(body.message).to.be.equal('success');
        expect(body.code).to.be.equal(200);
        expect(body.result).to.be.equal('deleted');
        done();
      }, err => {
        console.log('Error!');
        console.log(err);
      });
  });
});

