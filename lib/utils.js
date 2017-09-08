const debug = require('debug')('utils');
const CloudGenix = require('./api');
const moment = require('moment');

class Client extends CloudGenix {

  getAllEvents (options = {
    'type': 'alarm',
    'timeDelta': null,
    'exclude': []
  }) {

    if (!Object.prototype.hasOwnProperty.call(options, 'type')) {
      options.type = 'alarm';
    }

    if (!Object.prototype.hasOwnProperty.call(options, 'exclude')) {
      options.exclude = [];
    }

    if (options.timeDelta) {
      options.startTime = moment().subtract(options.timeDelta, 'm')
        .toISOString();
      options.endTime = moment().toISOString();
    } else {
      options.startTime = null;
      options.endTime = null;
    }

    let offset = null;
    let items = [];

    const events = () => this.queryEvents({
      '_offset': offset,
      'start_time': options.startTime,
      'end_time': options.endTime,
      'limit': {},
      'query': {'type': options.type},
      'severity': [],
      'summary': false
    }).then((value) => {

      debug('Query Events: %o', value);

      if (value._offset) { // eslint-disable-line no-underscore-dangle
        offset = value._offset; // eslint-disable-line no-underscore-dangle
        items = items.concat(value.items);
        return events();
      }

      return items.concat(value.items);

    }); // eslint: events

    return events().then((value) => value.filter((item) => options.exclude
      .includes(item.code) === false)); // eslint: return events

  } // eslint: getAllEvents

} // eslint: Class Client

module.exports = Client;
