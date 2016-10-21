Tinytest.add('Logger acquisition - Get a valid logger', function (test) {
  Meteor.settings = {};
  Logger.resetLevels();

  var logger = Logger.getLogger('test:package1');
  test.isNotNull(logger, 'Should get a valid logger object');

  test.isNotNull(logger.trace);
  test.isNotNull(logger.debug);
  test.isNotNull(logger.log);
  test.isNotNull(logger.info);
  test.isNotNull(logger.warn);
  test.isNotNull(logger.error);
});

Tinytest.add('Logger acquisition - Get cached logger', function (test) {
  Meteor.settings = {};
  Logger.resetLevels();

  var loggerA = Logger.getLogger('test:package2');

  var loggerB = Logger.getLogger('test:package2');

  var loggerC = Logger.getLogger('test:AnotherPackage2');

  test.isTrue(loggerA === loggerB);
  test.isFalse(loggerA === loggerC);
});

Tinytest.add('Display logger output', function (test) {
  Meteor.settings = {};
  Logger.resetLevels();

  var logger = Logger.getLogger('test:output3');

  logger.trace('Trace message');
  logger.debug('Debug message');
  logger.log('Log message');
  logger.info('Info message');
  logger.warn('Warn message');
  logger.error('Error message');
  test.ok();
});

Tinytest.add('Log levels - Test log levels', function (test) {
  Meteor.settings = {};
  Logger.resetLevels();

  test.equal(Logger.getLogger('app1').getLevel(), 'INFO');

  var levels = [];
  levels['app1:module1:submodule1'] = 'DEBUG';
  levels['app1:module1'] = 'TRACE';
  levels['app1:module1:submodule3'] = 'warn';

  Logger.setLevels(levels);

  test.equal(Logger.getLogger('app1:module1:submodule1').getLevel(), 'DEBUG');
  test.equal(Logger.getLogger('app1:module1:submodule1:func1').getLevel(), 'DEBUG');
  test.equal(Logger.getLogger('app1:module1:submodule2').getLevel(), 'TRACE');
  test.equal(Logger.getLogger('app1:module1:submodule3').getLevel(), 'WARN');
  test.equal(Logger.getLogger('app1:module2').getLevel(), 'INFO');

  var logger = Logger.getLogger('app2:module1')
  test.equal(logger.getLevel(), 'INFO');
  Logger.setLevel('app2', 'DEBUG');
  test.equal(logger.getLevel(), 'DEBUG');

  test.isTrue(logger.debug('debug'));
  test.isFalse(logger.trace('trace'));
});

Tinytest.add('Log levels - Test invalid log level', function (test) {
  Meteor.settings = {};
  Logger.resetLevels();

  test.throws(function() { Logger.setLevel('XXX'); });
  test.throws(function() { Logger.setLevel(3); });
  test.throws(function() { Logger.setLevel(null); });
  test.throws(function() { Logger.setLevel(undefined); });
});

Tinytest.add('Log levels - Complete log levels test ', function (test) {
  Meteor.settings = {};
  Logger.resetLevels();

  var l = Logger.getLogger('level:test');
  l.setLevel('TRACE');
  test.isTrue(l.trace('trace'));
  test.isTrue(l.debug('debug'));
  test.isTrue(l.info('info'));
  test.isTrue(l.log('log'));
  test.isTrue(l.warn('warn'));
  test.isTrue(l.error('error'));

  l.setLevel('DEBUG');
  test.isFalse(l.trace('trace'));
  test.isTrue(l.debug('debug'));
  test.isTrue(l.info('info'));
  test.isTrue(l.log('log'));
  test.isTrue(l.warn('warn'));
  test.isTrue(l.error('error'));

  l.setLevel('INFO');
  test.isFalse(l.trace('trace'));
  test.isFalse(l.debug('debug'));
  test.isTrue(l.info('info'));
  test.isTrue(l.log('log'));
  test.isTrue(l.warn('warn'));
  test.isTrue(l.error('error'));

  l.setLevel('WARN');
  test.isFalse(l.trace('trace'));
  test.isFalse(l.debug('debug'));
  test.isFalse(l.info('info'));
  test.isFalse(l.log('log'));
  test.isTrue(l.warn('warn'));
  test.isTrue(l.error('error'));

  l.setLevel('ERROR');
  test.isFalse(l.trace('trace'));
  test.isFalse(l.debug('debug'));
  test.isFalse(l.info('info'));
  test.isFalse(l.log('log'));
  test.isFalse(l.warn('warn'));
  test.isTrue(l.error('error'));
});

Tinytest.add('Test log settings', function (test) {

  Meteor.settings = {
    public: {
      client_logging: {
        default: 'WARN',
        levels: {
          settings: {
            'debug-logger': 'DEBUG',
            'info-logger' : 'INFO'
          }
        }
      }
    },
    server_logging: {
      default: 'DEBUG',
      levels: {
        settings: {
          'debug-logger': 'DEBUG',
          'info-logger' : 'INFO',
          module: {
            submodule: {
              'function': 'ERROR'
            }
          }
        }
      }
    }
  };

  //Re-reads the Meteor.settings
  Logger.resetLevels();

  if (Meteor.isClient) {
    test.equal(Logger.getLogger('settings:default-logger').getLevel(), 'WARN',
      'The default logger for a client should be WARN');
  } else {
    test.equal(Logger.getLogger('settings:default-logger').getLevel(), 'DEBUG',
      'The default logger for a server should be DEBUG');
  }
  test.equal(Logger.getLogger('settings:debug-logger').getLevel(), 'DEBUG',
    'The debug-logger should be DEBUG');
  test.equal(Logger.getLogger('settings:info-logger').getLevel(), 'INFO',
    'The debug-info should be INFO');

  if (Meteor.isClient) {
    test.equal(Logger.getLogger('settings:module:submodule:function').getLevel(),
     'WARN', 'Non existent key should fall back to default');
  } else {
    test.equal(Logger.getLogger('settings:module:submodule:function').getLevel(),
     'ERROR', 'Server key should be ERROR');
  }
});

// Default log levels

Tinytest.add('Default log levels - A new logger picks the default logging level', function (test) {
  Meteor.settings = {};
  Logger.resetLevels();

  var logger = Logger.getLogger('testLogLevel1');
  test.equal(logger.getLevel(), Logger.getDefaultLevel());
});

Tinytest.add('Default log levels - Changing the default logging level is applied on new loggers', function (test) {
  Meteor.settings = {};
  Logger.resetLevels();

  Logger.setDefaultLevel('WARN');

  var logger = Logger.getLogger('testLogLevel2');
  test.equal(logger.getLevel(), 'WARN');
});

Tinytest.add('Default log levels - Changing the default logging level is applied on existing loggers', function (test) {
  Meteor.settings = {};
  Logger.resetLevels();

  var logger = Logger.getLogger('testLogLevel3');
  test.equal(logger.getLevel(), Logger.getDefaultLevel());

  Logger.setDefaultLevel('WARN');
  test.equal(logger.getLevel(), 'WARN');
});

Tinytest.add('Default log levels - Changing the default logging level does not change explicitly set logging values', function (test) {
  Meteor.settings = {};
  Logger.resetLevels();

  var logger = Logger.getLogger('testLogLevel4');

  Logger.setLevel('testLogLevel4', 'ERROR');
  test.equal(logger.getLevel(), 'ERROR');

  Logger.setDefaultLevel('WARN');
  test.equal(logger.getLevel(), 'ERROR');
});