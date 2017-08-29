/* eslint-disable no-process-env */

const CloudGenix = require('../index');

const cg = new CloudGenix({
  'user': process.env.CG_USERNAME,
  'pass': process.env.CG_PASSWORD
});

cg.login()
  .then(() => cg.getAllEvents({'timeDelta': 10}))
  .then((value) => {

    console.log(value, value.length);
    return cg.logout();

  })
  .then((value) => console.log(value))
  .catch((reason) => console.log(reason));
