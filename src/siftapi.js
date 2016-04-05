'use strict';

import crypto from 'crypto';
import request from 'request-promise';

import { sortObj, buildUrl, values } from './utils';

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
  _generateParams(
    timestamp = Math.floor(Date.now() / 1000)
  ) {
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
   * @param {string} path - Endpoint of the API call, without the version number
   * @param {object} params - URL parameters
   * @param {object} data - Body parameters
   */
  _request(method, path, params = {}, data = {}) {
    let url = buildUrl(URL, path);
    let qs = {
      ...params,
      ...this._generateParams()
    };
    qs.signature = this._generateSignature(method, path, qs, data);

    let options = {
      method: method,
      uri: url,
      json: true,
      qs,
      form: data
    };

    return request(options)
  }

  /**
   * @public
   * Adds a Sift user
   *
   * @param {string} username - Username of your user
   * @param {string} locale - Locale of the new user, e.g. en_US
   */
  addUser(username, locale) {
    let options = {
      method: 'POST',
      path: '/users',
      params: {},
      data: { username, locale }
    };
    let args = values(options);
    return this._request(...args);
  }

  /**
   * @public
   * Deletes a Sift user
   *
   * @param {string} username - Username of Sift user to delete
   */
  deleteUser(username) {
    let options = {
      method: 'DELETE',
      path: `/users/${username}`,
      params: {},
      data: {}
    };
    let args = values(options);
    return this._request(...args);
  }

  /**
   * @public
   * List all email connections by the user
   *
   * @param {string} username
   */
  getEmailConnections(username) {
    let options = {
      method: 'GET',
      path: `/users/${username}/email_connections`,
      params: {},
      data: {}
    };
    let args = values(options);
    return this._request(...args);
  }

  /**
   * @public
   * Adds a new email connection to the Sift user
   *
   * @param {string} username
   * @param {string} accountType - google/yahoo/llive/imap/exchange
   * @param {object} emailParams - email specific parameters
   *  see here: https://sift.easilydo.com/sift/documentation#email-connections-endpoint-add
   */
  addEmailConnection(username, accountType, emailParams) {
    let options = {
      method: 'POST',
      path: `/users/${username}/email_connections`,
      params: {},
      data: {
        account_type: accountType,
        ...emailParams
      }
    };
    let args = values(options);
    return this._request(...args);
  }

  /**
   * @public
   * Deletes an email connection from user
   *
   * @param {string} username
   * @param {integer} connectionId - connection ID of email connection to delete
   */
  deleteEmailConnection(username, connectionId) {
    let options = {
      method: 'DELETE',
      path: `/users/${username}/email_connections/${connectionId}`,
      params: {},
      data: {}
    };
    let args = values(options);
    return this._request(...args);
  }

  /**
   * @public
   * Get list of Sifts of a user
   *
   * @param {string} username
   */
  getSifts(username) {
    let options = {
      method: 'GET',
      path: `/users/${username}/sifts`,
      params: {},
      data: {}
    };
    let args = values(options);
    return this._request(...args);
  }

  /**
   * @public
   * Get specific Sift belonging to a user
   *
   * @param {string} username
   * @param {integer} siftId - ID of Sift to get from the user
   */
  getSift(username, siftId) {
    let options = {
      method: 'GET',
      path: `/users/${username}/sifts/${siftId}`,
      params: {},
      data: {}
    };
    let args = values(options);
    return this._request(...args);
  }

  /**
   * @public
   * Returns a connect token for the given username
   *
   * @param {string} username
   */
  getConnectToken(username) {
    let options = {
      method: 'POST',
      path: `/connect_token`,
      params: { username },
      data: {}
    };
    let args = values(options);
    return this._request(...args);
  }

  /**
   * @public
   * Notify EasilyDo of emails that Sift did not parse correctly
   *
   * @param {string} email - Contents of eml file
   * @param {string} locale - Locale of the email, e.g. en_US
   * @param {string} timezone - Timezone of the email, e.g. America/Los_Angeles
   */
  postFeedback(email, locale, timezone) {
    let options = {
      method: 'POST',
      path: `/feedback`,
      params: {
        email,
        locale,
        timezone
      },
      data: {}
    };
    let args = values(options);
    return this._request(...args);
  }
}

