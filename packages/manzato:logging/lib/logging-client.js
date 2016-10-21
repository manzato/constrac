// Formats and prints the message using the console
const _print = function(type, level, ns, callerArgs, show_timestamp, show_package) {
  // turn args from an array-like obj to a real array
  const args = Array.prototype.slice.call(callerArgs);

  if (show_package) {
    // Add to the beginning of the arguments the package & level
    args.unshift('[' + ns + '|' + level + ']');
  }

  // forward args to console method, so the objects (like stacks) will print nicely
  console[type].apply(console, args);
  return true;
};

LoggerObject.prototype.trace = function() {
  return _print('debug', 'TRACE', this.namespace, arguments,
    this.show_timestamp, this.show_package);
};

LoggerObject.prototype.debug = function() {
  return _print('debug', 'DEBUG', this.namespace, arguments,
    this.show_timestamp, this.show_package);
};

LoggerObject.prototype.warn = function() {
  return _print('warn', 'WARN ', this.namespace, arguments,
    this.show_timestamp, this.show_package);
};

LoggerObject.prototype.error = function() {
  return _print('warn', 'ERROR', this.namespace, arguments,
    this.show_timestamp, this.show_package);
};
