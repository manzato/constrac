
const levels = ['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR'];

const _noop = function() {
  return false;
};

const getValidLevel = function(level) {
  if (level && _.isString(level)) {
    const l = level.toUpperCase();
    if (_.contains(levels,l)) {
      return l
    }
  }
  throw new Error('Invalid log level:', level);
};

// Object returned by Logger.getLogger containing the available logging methods
LoggerObject = function(namespace, show_timestamp, show_package) {
  this.namespace = namespace;
  this.show_timestamp = show_timestamp;
  this.show_package = show_package;
};

//The extra space at the end of 'INFO ' is
// for the output alignment of the logs
LoggerObject.prototype.log = function() {
  return _print('log', 'INFO ', this.namespace, arguments,
    this.show_timestamp, this.show_package);
};

LoggerObject.prototype.info = function() {
  return _print('log', 'INFO ', this.namespace, arguments,
    this.show_timestamp, this.show_package);
};

LoggerObject.prototype.getLevel = function() {
  return this.level;
};

/*
 Sets the level for this particular logger object.
 To disable a level, we place a noop function masking the prototype
 function. >ERROR< level can't be disabled.
*/
LoggerObject.prototype.setLevel = function(level) {
  this.level = getValidLevel(level);

  switch(this.level) {
    case 'TRACE':
      delete this.trace;
      delete this.debug;
      delete this.info;
      delete this.log;
      delete this.warn;
      break;
    case 'DEBUG':
      this.trace = _noop;
      delete this.debug;
      delete this.info;
      delete this.log;
      delete this.warn;
      break;
    case 'INFO':
      this.trace = _noop;
      this.debug = _noop;
      delete this.info;
      delete this.log;
      delete this.warn;
      break;
    case 'WARN':
      this.trace = _noop;
      this.debug = _noop;
      this.info = _noop;
      this.log = _noop;
      delete this.warn;
      break;
    case 'ERROR':
      this.trace = _noop;
      this.debug = _noop;
      this.info = _noop;
      this.log = _noop;
      this.warn = _noop;
      break;
  }
};
