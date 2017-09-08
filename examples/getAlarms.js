const CloudGenix = require('../index');

const cg = new CloudGenix({
  'user': process.env.CG_USERNAME,
  'pass': process.env.CG_PASSWORD
});

cg.login()
  .then(() => cg.getAllEvents({
    'exclude': [
      'APPLICATION_APP_UNREACHABLE',
      'APPLICATION_APP_UNKNOWN',
      'APPLICATION_IP_COLLISION'
    ]
  }))
  .then((value) => {
    console.log(JSON.stringify(value, null, 2), value.length);
    return cg.logout();
  })
  .catch((reason) => {
    console.log(reason);
    cg.logout();
  });
