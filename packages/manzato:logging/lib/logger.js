
/*
Usage:

const logger = Logger.getLogger("my-package:module:function");
logger.debug('what?');
logger.info('Hello!');
logger.warn('Brrrrr!');

Meteor Settings:
{
  public: {
    client_logging: { // This affects to client logging
      default: 'WARN', //Defaults to INFO
      levels: {
        moduleA: {
          submoduleA: 'DEBUG'
        }
      }
    }
  },
  server_logging: { // This affects to server logging
    default: 'DEBUG', //Defaults to INFO
    levels: {
      moduleB: {
        submoduleB: 'WARN'
      }
    }
  }
}
*/

// Too bad we don't have loggers ;-)
const TRACE = false;

const PACKAGE_SEPARATOR = ':';

const loggers = {};
let namespaceLevels = {};
let defaultLevel;
let showTimestamp;
let showPackage;
let initialized = false;

const getConfigValue = (key, defVal) => {
  const keys = key.split('.');

  let node = Meteor.settings;
  for (let i = 0 ; i < keys.length ; i++) {
    const k = keys[i];
    if (!(k in node)) {
      return defVal;
    }
    node = node[k];
  }
  return node;
};

const initialize = function() {
  TRACE && console.log('Initializing Logger');

  const key = (Meteor.isClient ? 'public.logging' : 'logging');

  defaultLevel = getConfigValue(key + '.default', 'DEBUG');

  TRACE && console.log('Default level (', key, ') :', defaultLevel);

  const levels = getConfigValue(key + '.levels', {});

  namespaceLevels = populateLevels(levels);

  TRACE && console.log('Namespace levels:', namespaceLevels);

  // Client dont't show timestamps
  showTimestamp = Meteor.isServer && Boolean(getConfigValue(key + '.show_timestamp', false));

  TRACE && console.log('Show timestamp:', showTimestamp);

  // Show timestamps
  showPackage = Boolean(getConfigValue(key + '.show_package', true));

  TRACE && console.log('Show package:', showPackage);

  initialized = true;
};

//Flatterns the settings object to an object to 1-level string keys
const populateLevels = function(levels, current) {
  const r = {};
  _.each(levels, function(level, key) {
    const c = current ? current+PACKAGE_SEPARATOR+key : key;
    if (_.isObject(level)) {
      _.extend(r, populateLevels(level, c));
    } else {
      r[c] = level;
    }
  });
  return r;
};

const getLevelForNamespace = function(namespace) {
  let current = namespace;
  do {
    if (namespaceLevels[current]) {
      return namespaceLevels[current];
    }
    const ndx = current.lastIndexOf(PACKAGE_SEPARATOR);

    current = ndx == -1 ? null : current.substring(0, ndx);
  } while(current != null);
  return defaultLevel;
};

const resetLevels = function() {
  _.each(loggers, function(logger) {
    logger.setLevel(getLevelForNamespace(logger.namespace));
  });
};

Logger = {
  getLogger: function(namespace) {
    !initialized && initialize();

    if (!loggers[namespace]) {
      loggers[namespace] = new LoggerObject(namespace, showTimestamp, showPackage);
      const level = getLevelForNamespace(namespace);
      loggers[namespace].setLevel(level);
    }
    return loggers[namespace];
  },

  setDefaultLevel: function(level) {
    defaultLevel = level;
    resetLevels();
  },

  getDefaultLevel: function() {
    return defaultLevel;
  },

  setLevels: function(levels) {
    namespaceLevels = levels;
    resetLevels();
  },

  setLevel: function(namespace, level) {
    namespaceLevels[namespace] = getValidLevel(level);
    resetLevels();
  },

  resetLevels: function() {
    initialized = false;
    initialize();
  }
};

export {
  Logger
};
