const debug = require('debug')('wrapper');
const rp = require('request-promise-native');
const {version} = require('../package.json');

module.exports = {

  /**
   * Wrapper around request-promise-native package for GET request.
   *
   * @param {Object} opts - Object with uri and requestjs options.
   * @returns {Promise} - A promise which resolves to the resource created.
   */
  'get': (opts) => {
    let options = {
      'uri': opts.uri,
      'headers': {
        'User-Agent': `github:sumitgoelpw/cloudgenix-api-client@${version}`,
        'X-Auth-Token': opts.token
      },
      'json': true,
      'gzip': true
    };

    options = Object.assign(options, opts.options);

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
    let options = {
      'uri': opts.uri,
      'headers': {
        'User-Agent': `github:sumitgoelpw/cloudgenix-api-client@${version}`,
        'X-Auth-Token': opts.token
      },
      'json': true,
      'gzip': true,
      'body': opts.body
    };

    options = Object.assign(options, opts.options);

    debug('HTTP POST Options: %o', options);

    return rp.post(options);
  } // eslint: post
};
