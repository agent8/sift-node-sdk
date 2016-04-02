'use strict';

import crypto from 'crypto';
import request from 'request-promise';

import { sortObj, buildUrl } from './utils';

const API_VERSION = 'v1';
const URL = `https://api.easilydo.com/${API_VERSION}`;

export default class SiftAPI {
  constructor(apiKey, apiSecret) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }

  /**
   * @private
   * Generates common parameters used by the Sift API
   *
   * @param {integer} timestamp - Unixtime, defaults to the time now
   */
  _generateParams(timestamp = Date.now()) {
    let result = {
      api_key: this.apiKey,
      timestamp
    };
    return result;
  }

  /**
   * @private
   * Generates signature to be used with Sift API.
   *
   * @param {string} method - GET/POST/PUT/DELETE
   * @param {string} path - Endpoint of the API call, without version number
   *                        e.g. `/users/<username>/sifts
   * @param {object} params - URL parameters
   * @param {object} data - Body parameters
   */
  _generateSignature(method, path, params, data) {
    let hmac = crypto.createHmac('sha1', this.apiSecret);
    let baseString = `${method.toUpperCase()}&/${API_VERSION}${path}`;
    let p = {
      ...params,
      ...data
    };

    for (let item in sortObj(p)) {
      baseString += `&${item}=${p[item]}`;
    }

    let baseStringBuffer = new Buffer(baseString, 'utf-8');
    return hmac.update(baseStringBuffer).digest('hex');
  }

  /**
   * @private
   * Makes a request to the API URL
   *
   * @param {string} method - GET/POST/PUT/DELETE
   * @param {path} path - Endpoint of the API call, without the version number
   * @param {object} params - URL parameters
   * @param {object} data - Body parameters
   */
  _request(method, path, params, data) {
    if (params === undefined) params = {};
    if (data === undefined) data = {};

    let url = buildUrl();
    let generatedParams = this._generateParams();
    params = { ...generatedParams };
    params.signature = this._generateSignature(method, path, params, data);

    let options = {
      uri: url,
      json: true,
      params,
      body: data
    };

    request(options)
      .then(body => {

      })
      .catch(err => {
        console.log(`Error!\n${err}`);
      });
  }
}

