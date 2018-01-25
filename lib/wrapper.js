/**
 * Dependencies
 */
const debug = require('debug')('wrapper');
const rp = require('request-promise-native');

/**
 * Options for HTTP request
 *
 * @param {Object} params - Constructor object for HTTP request options
 * @param {Object} obj - HTTP method specific options
 * @return {Object} - Processed options to make GET, POST HTTP calls.
 */
const reqOptions = (params, obj = {}) => {
  const options = {
    'uri': params.uri,
    'headers': {'X-Auth-Token': params.token},
    'json': true,
    'gzip': true
  };

  return Object.assign(options, obj, params.options);
};

module.exports = {

  /**
   * Wrapper around request-promise-native package for GET request.
   *
   * @param {Object} opts - Object with uri and requestjs options.
   * @returns {Promise} - A promise which resolves to the resource fetched.
   */
  'get': (opts) => {
    const options = reqOptions(opts);
    debug('HTTP GET Options: %o', options);
    return rp.get(options);
  }, // eslint: get

  /**
   * Wrapper around request-promise-native package for POST request.
   *
   * @param {Object} opts - Object with uri, body and requestjs options.
   * @returns {Promise} - A promise which resolves to the resource created.
   */
  'post': (opts) => {
    const options = reqOptions(opts, {'body': opts.body});
    debug('HTTP POST Options: %o', options);
    return rp.post(options);
  } // eslint: post
};
