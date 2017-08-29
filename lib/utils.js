const debug = require('debug')('utils');
const CloudGenix = require('./api');
const moment = require('moment');

class Client extends CloudGenix {

  getAllEvents(options = {
    'timeDelta': 10,
    'type': 'alarm'
  }) {

    // eslint-disable-next-line no-ternary, no-prototype-builtins
    options.timeDelta = options.hasOwnProperty('timeDelta') ? options.timeDelta : 10;

    // eslint-disable-next-line no-ternary, no-prototype-builtins
    options.type = options.hasOwnProperty('type') ? options.type : 'alarm';

    const startTime = moment().subtract(options.timeDelta, 'm').toISOString();
    const endTime = moment().toISOString();

    let offset = null;
    let items = [];

    const events = () => this.queryEvents({
      '_offset': offset,
      'start_time': startTime,
      'end_time': endTime,
      'limit': {},
      'query': { 'type': options.type },
      // 'query': {},
      'severity': [],
      'summary': false
    }).then(value => {

      debug('Query Events: %o', value);

      // eslint-disable-next-line no-underscore-dangle
      if (value._offset) {

        // eslint-disable-next-line no-underscore-dangle
        offset = value._offset;
        items = items.concat(value.items);
        return events();
      }

      return items.concat(value.items);
    }); // eslint: events function

    return events();
  } // eslint: getAllEvents

} // eslint: Class Client

module.exports = Client;