Package.describe({
  name: 'manzato:logging',
  summary: 'Simple logging service',
  version: '1.0.0'
});

Package.onUse(function(api) {
  api.versionsFrom('1.4.2.3');
  api.use([
    'underscore',
    'modules',
    'ecmascript',
    'momentjs:moment'
  ]);

  api.addFiles([
    'lib/logging-common.js',
    'lib/logger.js'
  ]);

  api.addFiles('lib/logging-client.js', 'client');
  api.addFiles('lib/logging-server.js', 'server');
  api.export('Logger', ['server', 'client']);

  api.mainModule('lib/logger.js', ['client', 'server']);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('manzato:logging');
  api.addFiles('test/logging-tests.js');
});
