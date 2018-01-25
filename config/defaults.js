module.exports = {
  'apiHost': 'https://api.cloudgenix.com',
  'versionMap': {
    'login': 'v2.0',
    'profile': 'v2.0',
    'query_events': 'v3.0',
    'logout': 'v2.0'
  },
  'uriMap': {
    'login': '/%s/api/login',
    'profile': '/%s/api/profile',
    'query_events': '/%s/api/tenants/%s/events/query',
    'logout': '/%s/api/logout'
  }
};
