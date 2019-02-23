import qs from 'qs';
import fetch from 'isomorphic-fetch';
import hmacSHA1 from 'crypto-js/hmac-sha1';

import { buildUrl, values } from './utils';

const API_VERSION = 'v1';
const URL = `https://api.easilydo.com/${API_VERSION}`;

export default class SiftAPI {
  /**
   * Initializes the Sift API object with your API key and secret.
   *
   * e.g. sift = new SiftAPI('dummyApiKey', 'dummyApiSecret');
   *
   * @param {string} apiKey
   * @param {string} apiSecret
   */
  constructor(apiKey, apiSecret) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }

  /**
   * @private
   * Generates common parameters used by the Sift API
   *
   * @param {integer} timestamp - Unixtime, defaults to the time now
   * @return {object} - object that includes common parameters
   */
  generateParams(timestamp = Math.floor(Date.now() / 1000)) {
    const result = {
      api_key: this.apiKey,
      timestamp,
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
   * @return {object} - signature string for Sift API requests
   */
  generateSignature(method, path, params, data) {
    let baseString = `${method.toUpperCase()}&/${API_VERSION}${path}`;
    const p = {
      ...params,
      ...data,
    };

    baseString += Object.keys(p)
      .sort()
      .reduce((prev, curr) => `${prev}&${curr}=${p[curr]}`, '');

    return hmacSHA1(baseString, this.apiSecret).toString();
  }

  /**
   * @private
   * Makes a request to the API URL
   *
   * @param {string} method - GET/POST/PUT/DELETE
   * @param {string} path - Endpoint of the API call, without the version number
   * @param {object} params - URL parameters
   * @param {object} data - Body parameters
   * @return {Promise} - Promise to be resolved by client
   */
  request(method, path, params = {}, data = {}) {
    const url = buildUrl(URL, path);
    const queryParams = {
      ...params,
      ...this.generateParams(),
    };
    queryParams.signature = this.generateSignature(
      method,
      path,
      queryParams,
      data
    );

    const options = {
      method,
      mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    if (method !== 'GET') {
      options.body = qs.stringify(data);
    }

    return fetch(`${url}?${qs.stringify(queryParams)}`, options).then(res =>
      res.json()
    );
  }

  /**
   * @public
   * Performs Discovery on the input eml file
   *
   * @param {string} emlFile - contents of the eml file
   * @return {Promise} - Promise to be resolved by client
   */
  discovery(emlFile) {
    const options = {
      method: 'POST',
      path: '/discovery',
      params: {},
      data: {
        email: emlFile.trim(),
      },
    };
    const args = values(options);
    return this.request(...args);
  }

  /**
   * @public
   * Adds a Sift user
   *
   * @param {string} username - Username of your user
   * @param {string} locale - Locale of the new user, e.g. en_US
   * @return {Promise} - Promise to be resolved by client
   */
  addUser(username, locale = 'en_US') {
    const options = {
      method: 'POST',
      path: '/users',
      params: {},
      data: { username, locale },
    };
    const args = values(options);
    return this.request(...args);
  }

  /**
   * @public
   * Deletes a Sift user
   *
   * @param {string} username - Username of Sift user to delete
   * @return {Promise} - Promise to be resolved by client
   */
  deleteUser(username) {
    const options = {
      method: 'DELETE',
      path: `/users/${username}`,
      params: {},
      data: {},
    };
    const args = values(options);
    return this.request(...args);
  }

  /**
   * @public
   * List all email connections by the user
   *
   * @param {string} username
   * @param {object} params {
   *   limit - The maximum number of results to return. Developer can set any
   *      value between 0 to 100 and max is 100. (Defaults to 100)
   *   offset - Start the list at this offset (zero-based)
   *   include_invalid - 1 to include invalid email connection in return
   *      result, 0 to ignore
   * }
   * @return {Promise} - Promise to be resolved by client
   */
  getEmailConnections(username, params) {
    const options = {
      method: 'GET',
      path: `/users/${username}/email_connections`,
      params,
      data: {},
    };
    const args = values(options);
    return this.request(...args);
  }

  /**
   * @public
   * Adds a new email connection to the Sift user
   *
   * @param {string} username
   * @param {string} accountType - google/yahoo/live/imap/exchange
   * @param {object} emailParams - email specific parameters
   *  see here: https://sift.easilydo.com/sift/documentation#email-connections-endpoint-add
   * @return {Promise} - Promise to be resolved by client
   */
  addEmailConnection(username, accountType, emailParams) {
    const options = {
      method: 'POST',
      path: `/users/${username}/email_connections`,
      params: {},
      data: {
        account_type: accountType,
        ...emailParams,
      },
    };
    const args = values(options);
    return this.request(...args);
  }

  /**
   * @public
   * Deletes an email connection from user
   *
   * @param {string} username
   * @param {integer} connectionId - connection ID of email connection to delete
   * @return {Promise} - Promise to be resolved by client
   */
  deleteEmailConnection(username, connectionId) {
    const options = {
      method: 'DELETE',
      path: `/users/${username}/email_connections/${connectionId}`,
      params: {},
      data: {},
    };
    const args = values(options);
    return this.request(...args);
  }

  /**
   * @public
   * Get list of Sifts of a user
   *
   * @param {string} username
   * @param {object} params {
   *   limit - The maximum number of results to return. Developer can set any
   *      value between 0 to 100 and max is 100. (Defaults to 100)
   *   offset - Start the list at this offset (zero-based)
   *   last_update_time - Epoch timestamp. Returns results with last update
   *      time greater than (that is, more recent than) the specified time.
   *   domains - A list of domains separated by comma. The domain should be one
   *      of the following string: flight, hotel, rentalcar, train, boardingpass,
   *      shipment, contact, purchase, reservation, event, deal, bill. If omited,
   *      this api will return the sifts with all domains.
   * }
   * @return {Promise} - Promise to be resolved by client
   */
  getSifts(username, params) {
    const options = {
      method: 'GET',
      path: `/users/${username}/sifts`,
      params,
      data: {},
    };
    const args = values(options);
    return this.request(...args);
  }

  /**
   * @public
   * Get specific Sift belonging to a user
   *
   * @param {string} username
   * @param {integer} siftId - ID of Sift to get from the user
   * @param {object} params {
   *    include_eml: 1 / 0
   * }
   * @return {Promise} - Promise to be resolved by client
   */
  getSift(username, siftId, params) {
    const options = {
      method: 'GET',
      path: `/users/${username}/sifts/${siftId}`,
      params,
      data: {},
    };
    const args = values(options);
    return this.request(...args);
  }

  /**
   * @public
   * Returns a connect token for the given username
   *
   * @param {string} username
   * @return {Promise} - Promise to be resolved by client
   */
  getConnectToken(username) {
    const options = {
      method: 'POST',
      path: '/connect_token',
      params: { username },
      data: {},
    };
    const args = values(options);
    return this.request(...args);
  }

  getDeveloperEmails(params) {
    const options = {
      method: 'GET',
      path: '/emails',
      params,
      data: {},
    };
    const args = values(options);
    return this.request(...args);
  }

  getUserEmails(username, params) {
    const options = {
      method: 'GET',
      path: `/users/${username}/emails`,
      params,
      data: {},
    };
    const args = values(options);
    return this.request(...args);
  }

  getUserEmail(username, emailId) {
    const options = {
      method: 'GET',
      path: `/users/${username}/emails/${emailId}`,
      params: {},
      data: {},
    };
    const args = values(options);
    return this.request(...args);
  }

  getEmailFilters(params) {
    const options = {
      method: 'GET',
      path: '/emails/filters',
      params,
      data: {},
    };
    const args = values(options);
    return this.request(...args);
  }

  addEmailFilter(description, rules) {
    const formattedRules = Object.keys(rules)
      .filter(field => {
        const predicate = Array.isArray(rules[field]);
        if (!predicate) {
          console.warn(
            `${field} is not an Array, not included in filter rules`
          );
        }

        return predicate;
      })
      .reduce(
        (prev, curr) => ({
          ...prev,
          // Each field should be a JSON string
          [curr]: JSON.stringify(rules[curr]),
        }),
        {}
      );

    const options = {
      method: 'POST',
      path: '/emails/filters',
      params: {},
      data: { description, ...formattedRules },
    };
    const args = values(options);
    return this.request(...args);
  }

  editEmailFilter(filterId, description, rules) {
    const formattedRules = Object.keys(rules)
      .filter(field => {
        const predicate = Array.isArray(rules[field]);
        if (!predicate) {
          console.warn(
            `${field} is not an Array, not included in filter rules`
          );
        }

        return predicate;
      })
      .reduce(
        (prev, curr) => ({
          ...prev,
          // Each field should be a JSON string
          [curr]: JSON.stringify(rules[curr]),
        }),
        {}
      );

    const options = {
      method: 'PUT',
      path: `/emails/filters/${filterId}`,
      params: {},
      data: { description, ...formattedRules },
    };
    const args = values(options);
    return this.request(...args);
  }

  deleteEmailFilter(filterId) {
    const options = {
      method: 'DELETE',
      path: `/emails/filters/${filterId}`,
      params: {},
      data: {},
    };
    const args = values(options);
    return this.request(...args);
  }

  /**
   * @public
   * Notify EasilyDo of emails that Sift did not parse correctly
   *
   * @param {string} email - Contents of eml file
   * @param {string} locale - Locale of the email, e.g. en_US
   * @param {string} timezone - Timezone of the email, e.g. America/Los_Angeles
   * @return {Promise} - Promise to be resolved by client
   */
  postFeedback(email, locale, timezone) {
    const options = {
      method: 'POST',
      path: '/feedback',
      params: {
        email,
        locale,
        timezone,
      },
      data: {},
    };
    const args = values(options);
    return this.request(...args);
  }
}
