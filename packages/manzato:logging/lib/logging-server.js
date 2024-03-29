const toFixedLength = function(str, length) {
  let diff = length - str.length;

  if (diff < 0) {
    str = '>' + str.substr(-(length - 1));
  } else {
    while (diff > 0) {
      str = str + ' ';
      diff--;
    }
  }
  return str;
};

// Formats and prints the message using the console
_print = function(type, level, ns, caller_args, show_timestamp, show_package) {
  // turn args from an array-like obj to a real array
  const args = Array.prototype.slice.call(caller_args);

  show_package && args.unshift('[' + toFixedLength(ns, 16) + '|' + level + ']');

  // Add timestamp as the first argument
  show_timestamp && args.unshift(moment().format('YYYYMMDD HH:mm:ss.SSS'));

  console[type].apply(console, args);
  return true;
};

LoggerObject.prototype.trace = function() {
  return _print('log', 'TRACE', this.namespace, arguments,
    this.show_timestamp, this.show_package);
};

LoggerObject.prototype.debug = function() {
  return _print('log', 'DEBUG', this.namespace, arguments,
    this.show_timestamp, this.show_package);
};

LoggerObject.prototype.warn = function() {
  return _print('log', 'WARN ', this.namespace, arguments,
    this.show_timestamp, this.show_package);
};

LoggerObject.prototype.error = function() {
  return _print('log', 'ERROR', this.namespace, arguments,
    this.show_timestamp, this.show_package);
};
