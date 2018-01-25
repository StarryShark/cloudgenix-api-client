/**
 * Dependencies
 */
const moment = require('moment');
const CloudGenix = require('./api');

/**
 * Extending Cloud Genix API Client with helper methods
 */
class Client extends CloudGenix {

  /**
   * @param {Object} options - Options to get all events.
   *
   * @returns {Promise} a promise which resolves to all the events.
   */
  getAllEvents (options = {}) {
    let startTime = null;
    let endTime = null;
    let offset = null;
    let items = [];

    if (options.timeDelta) {
      startTime = moment().subtract(options.timeDelta, 'm')
        .toISOString();
      endTime = moment().toISOString();
    }

    const events = () => this.queryEvents({
      '_offset': offset,
      'start_time': startTime,
      'end_time': endTime,
      'limit': {},
      'query': {},
      'severity': []
    }).then((value) => {
      if (value._offset) { // eslint-disable-line no-underscore-dangle
        offset = value._offset; // eslint-disable-line no-underscore-dangle
        items = items.concat(value.items);
        return events();
      }

      return items.concat(value.items);
    }); // eslint: events

    return events();
  } // eslint: getAllEvents

} // eslint: Class Client

module.exports = Client;
