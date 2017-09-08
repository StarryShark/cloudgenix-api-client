const req = require('./wrapper');

class CloudGenix {

  constructor (params) {
    this.params = params;
    this.token = null;
  }

  paramsValidation () {

    // eslint-disable-next-line max-statements
    return new Promise((resolve, reject) => {

      const arr = [
        'user',
        'pass'
      ];

      const hasUserPass = arr.every((item) => Object.prototype.hasOwnProperty
        .call(this.params, item));

      if (hasUserPass) {

        if (!Object.prototype.hasOwnProperty.call(this.params, 'url')) {
          this.params.url = 'https://api.cloudgenix.com';
        }

        if (!Object.prototype.hasOwnProperty.call(this.params, 'apiVersion')) {
          this.params.apiVersion = 'v2.0';
        }

        if (!Object.prototype.hasOwnProperty.call(this.params, 'options')) {
          this.params.options = {};
        }

        resolve(this.params);

      } else {

        reject(new Error('undefined: user and/or pass'));

      }

    }); // eslint: return promise
  } // eslint: paramsValidation

  /**
   * This method queries the permissions endpoint and add resource maps.
   *
   * @returns {Promise} a promise which resolves to the http response.
   */
  permissions () {

    const opts = {
      'uri': `${this.params.url}/${this.params.apiVersion}/api/permissions`,
      'token': this.token,
      'options': this.params.options
    };

    return req.get(opts).then((value) => {
      this.versionMap = value.resource_version_map;
      this.uriMap = value.resource_uri_map;
      this.roleMap = value.resource_role_map;
      return value;
    });

  } // eslint: permissions

  /**
   * This method queries the profile endpoint and add tenant_id.
   *
   * @returns {Promise} a promise which resolves to the http response.
   */
  profile () {

    const version = this.versionMap.profile;
    const baseUrl = this.uriMap.profile.replace('%s', version);

    const opts = {
      'uri': `${this.params.url}${baseUrl}`,
      'token': this.token,
      'options': this.params.options
    };

    return req.get(opts).then((value) => {
      this.tenantId = value.tenant_id;
      return value;
    });

  } // eslint: profile

  /**
   * This method allows to log in to the API and generate an authentication
   * token for subsequent API calls.
   *
   * @returns {Promise} a promise which resolves to the http response.
   */
  login () {

    const returnLoginPermResponse = {};

    return this.paramsValidation().then(() => req.post({
      'uri': `${this.params.url}/${this.params.apiVersion}/api/login`,
      'token': this.token,
      'body': {
        'email': this.params.user,
        'password': this.params.pass
      },
      'options': this.params.options
    }))
      .then((value) => {
        this.token = value.x_auth_token;
        returnLoginPermResponse.login = value;
        return this.permissions();
      })
      .then((value) => {
        returnLoginPermResponse.permissions = value;
        return this.profile();
      })
      .then((value) => {
        returnLoginPermResponse.profile = value;
        return returnLoginPermResponse;
      });

  } // eslint: login

  /**
   * This method queries the events.
   *
   * @param {string} body - HTTP POST body
   * @returns {Promise} a promise which resolves to the http response.
   */
  queryEvents (body) {

    const version = this.versionMap.query_events;
    const baseUrl = `/${version}/api/tenants/${this.tenantId}/events/query`;

    const opts = {
      'uri': `${this.params.url}${baseUrl}`,
      'token': this.token,
      'options': this.params.options,
      body
    };

    return req.post(opts);

  } // eslint: queryEvents

  /**
   * This method allows to log out of the API and invalidates the current
   * authentication token.
   *
   * @returns {Promise} a promise which resolves to the http response.
   */
  logout () {
    const version = this.versionMap.logout;
    const baseUrl = this.uriMap.logout.replace('%s', version);

    const opts = {
      'uri': `${this.params.url}${baseUrl}`,
      'token': this.token,
      'options': this.params.options
    };

    return req.get(opts);
  } // eslint: logout

} // eslint: class

module.exports = CloudGenix;
