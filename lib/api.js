/**
 * Dependencies
 */
const debug = require('debug')('api');
const {vsprintf} = require('sprintf-js');
const req = require('./wrapper');
const conf = require('../config/defaults');

/**
 * Cloud Genix API Client Object
 */
class CloudGenix {

  /**
   * Instantiate the API Client
   *
   * @param {Object} params API call parameters
   */
  constructor (params) {
    this.url = params.url || conf.apiHost;
    this.versionMap = Object.assign(conf.versionMap, params.versionMap);
    this.uriMap = Object.assign(conf.uriMap, params.uriMap);
    this.options = params.options || {};
    this.token = null;

    if (params.user) {
      this.user = params.user;
    } else {
      throw new Error('undefined user');
    }

    if (params.pass) {
      this.pass = params.pass;
    } else {
      throw new Error('undefined password');
    }
  }

  /**
   * This method allows to log in to the API and generate an authentication
   * token for subsequent API calls.
   *
   * @returns {Promise} a promise which resolves to login success.
   */
  login () {
    const version = this.versionMap.login;
    const baseUrl = vsprintf(this.uriMap.login, [version]);

    return req.post({
      'uri': `${this.url}${baseUrl}`,
      'token': this.token,
      'body': {
        'email': this.user,
        'password': this.pass
      },
      'options': this.options
    })
      .then((value) => {
        debug('Login Response: %o', value);
        this.token = value.x_auth_token;
        return this.profile();
      })
      .then((value) => {
        debug('Profile Response: %o', value);
        return 'Success';
      });
  } // eslint: login

  /**
   * This method queries the profile endpoint and add tenant_id.
   *
   * @returns {Promise} a promise which resolves to the profile information.
   */
  profile () {
    const version = this.versionMap.profile;
    const baseUrl = vsprintf(this.uriMap.profile, [version]);

    const opts = {
      'uri': `${this.url}${baseUrl}`,
      'token': this.token,
      'options': this.options
    };

    return req.get(opts).then((value) => {
      this.tenantId = value.tenant_id;
      return value;
    });
  } // eslint: profile

  /**
   * This method queries the events.
   *
   * @param {string} body - HTTP POST body
   * @returns {Promise} a promise which resolves to the events.
   */
  queryEvents (body) {
    const version = this.versionMap.query_events;
    const baseUrl = vsprintf(this.uriMap.query_events, [
      version,
      this.tenantId
    ]);

    const opts = {
      'uri': `${this.url}${baseUrl}`,
      'token': this.token,
      'options': this.options,
      body
    };

    return req.post(opts).then((value) => {
      debug('Query Events Response: %o', value);
      return value;
    });
  } // eslint: queryEvents

  /**
   * This method allows to query a list of all sites for a unique customer
   * tenant ID.
   *
   * @param {boolean} itemsOnly return only items or full response
   * @returns {Promise} a promise which resolves to a list of all sites.
   */
  sites (itemsOnly = false) {
    const version = this.versionMap.sites;
    const baseUrl = vsprintf(this.uriMap.sites, [
      version,
      this.tenantId
    ]);

    const opts = {
      'uri': `${this.url}${baseUrl}`,
      'token': this.token,
      'options': this.options
    };

    return req.get(opts).then((value) => {
      debug('Sites Response: %o', value);
      if (itemsOnly) {
        return value.items;
      }
      return value;
    });
  } // eslint: sites

  /**
   * This method allows to query a list of all elements (IONs) for a unique
   * customer tenant ID.
   *
   * @param {boolean} itemsOnly return only items or full response
   * @returns {Promise} a promise which resolves to a list of all elements.
   */
  elements (itemsOnly = false) {
    const version = this.versionMap.elements;
    const baseUrl = vsprintf(this.uriMap.elements, [
      version,
      this.tenantId
    ]);

    const opts = {
      'uri': `${this.url}${baseUrl}`,
      'token': this.token,
      'options': this.options
    };

    return req.get(opts).then((value) => {
      debug('Elements Response: %o', value);
      if (itemsOnly) {
        return value.items;
      }
      return value;
    });
  } // eslint: elements

  /**
   * Machines API
   *
   * @param {boolean} itemsOnly return only items or full response
   * @returns {Promise} a promise which resolves to a list of all machines.
   */
  machines (itemsOnly = false) {
    const version = this.versionMap.machines;
    const baseUrl = vsprintf(this.uriMap.machines, [
      version,
      this.tenantId
    ]);

    const opts = {
      'uri': `${this.url}${baseUrl}`,
      'token': this.token,
      'options': this.options
    };

    return req.get(opts).then((value) => {
      debug('Machines Response: %o', value);
      if (itemsOnly) {
        return value.items;
      }
      return value;
    });
  } // eslint: machines

  /**
   * This method allows to log out of the API and invalidates the current
   * authentication token.
   *
   * @returns {Promise} a promise which resolves to the logout response.
   */
  logout () {
    const version = this.versionMap.logout;
    const baseUrl = vsprintf(this.uriMap.logout, [version]);

    const opts = {
      'uri': `${this.url}${baseUrl}`,
      'token': this.token,
      'options': this.options
    };

    return req.get(opts).then((value) => {
      debug('Logout Response: %o', value);
      return value;
    });
  } // eslint: logout
} // eslint: class

module.exports = CloudGenix;
