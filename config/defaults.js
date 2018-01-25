module.exports = {
  'apiHost': 'https://api.cloudgenix.com',
  'versionMap': {
    'login': 'v2.0',
    'profile': 'v2.0',
    'query_events': 'v3.0',
    'sites': 'v4.1',
    'elements': 'v2.0',
    'logout': 'v2.0'
  },
  'uriMap': {
    'login': '/%s/api/login',
    'profile': '/%s/api/profile',
    'query_events': '/%s/api/tenants/%s/events/query',
    'sites': '/%s/api/tenants/%s/sites',
    'elements': '/%s/api/tenants/%s/elements',
    'logout': '/%s/api/logout'
  }
};
