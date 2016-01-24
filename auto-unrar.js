var unrar = require('standalone-unrar');
var glob = require('glob');
var path = require('path');
var fs = require('fs');

/**
 * Unrar all files recursively if they don't exits given by
 * a entry point root directory.
 *
 * @example
 * ```js
 * autoUnrar('~/Documents/myDirectory', function (err, data) {
 *   // data is an object with archives as keys and entries on data.
 *   // example:
 *   // {
 *   //   'some-file.rar': {
 *   //     skip: false,
 *   //     outputFile: 'some/path/some-file.dat',
 *   //     entry: 'some-file'
 *   //   }
 *   // }
 * });
 * ```
 *
 * @example
 * CLI Usage
 * ```
 * auto-unrar
 *
 *   Automatic unpack all recursive rar-files from a directory.
 *
 * Options
 *
 *   -h, --help              Display this usage info
 *   -v, --verbose           Log all information
 *   --cwd string            What folder to use as base directory (root search directory)
 *   -i, --interval number   Set interval in minutes for periodic check. Default value is 5 minutes.
 *
 *   Full help (project repo): https://github.com/mikaelbr/auto-unrar
 * ```
 * @param {String} cwd - Path to search for rar-files
 * @param {Function(err, data)} callback - Callback after all data has been unpacked
 **/
function autoUnrar (cwd, cb) {
  var opts = { cwd: cwd || process.cwd() };
  return unpackAll(opts, cb);
}

module.exports = autoUnrar;
module.exports.poll = poll;

/**
 * Automatically poll defined by interval recursively from root
 * defined as cwd from the options.
 *
 * @example
 * ```js
 * autoUnrar.poll('~/Documents/myDirectory', function (err, data) {
 *   // data is an object with archives as keys and entries on data.
 *   // example:
 *   // {
 *   //   'some-file.rar': {
 *   //     skip: false,
 *   //     outputFile: 'some/path/some-file.dat',
 *   //     entry: 'some-file'
 *   //   }
 *   // }
 * });
 *
 * autoUnrar.poll({
 *   cwd: '~/Documents/myDirectory',
 *   interval: 10, // every 10 mintues
 *   beforeHook: function () { console.log('About to search for files') }
 * }, function (err, data) {
 *
 * });
 * ```
 *
 * @param {String|Object} - Path to search for rar-files or options object
 * @param {String} options.cwd - Path to search for rar-files
 * @param {Number} options.interval - Polling interval in minutes
 * @param {Function} options.beforeHook - Hook before each unpacking search
 * @param {Function(err, data)} callback - Callback after all data has been unpacked
 * @returns {Function} Function to stop polling for packages.
 **/
function poll (options, cb) {
  var cwd = options.cwd;
  var interval = options.interval;
  var beforeHook = options.beforeHook || function () { };

  var timeout;

  recursiveAutoUnrar();
  function recursiveAutoUnrar () {
    beforeHook(options);
    autoUnrar(cwd, cb);
    timeout = setTimeout(recursiveAutoUnrar, minutesToMs(interval));
  }

  return function unsubscribe () {
    timeout && clearTimeout(timeout);
  };
}

function unpackAll (opts, cb) {
  glob('./**/*.rar', opts, function (err, entries) {
    if (err) return cb(err);
    var currentData = 0;
    var completeData = {};
    var completeError = {};
    var filteredEntries = uniquePerBasename(entries);
    var numEntries = filteredEntries.length;

    filteredEntries.forEach(function (entry) {
      var fullPath = path.join(opts.cwd, entry);
      return unpack(fullPath, function (err, data) {
        var source = err ? completeError : completeData;
        source[entry] = data;
        if (++currentData === entries.length) {
          cb(completeError, completeData);
        }
      });
    });
  });
}

function unpack (fullPath, cb) {
  var base = path.dirname(fullPath);
  var archive = unrar(normalisePath(fullPath));

  archive.list(function (err, entries) {
    if (err) return cb(err);
    entries.forEach(unrarIfNotExists.bind(null, archive, base, cb));
  });
}

function unrarIfNotExists (archive, base, cb, entry) {
  var outputFile = path.join(base, entry);
  itemExists(outputFile, function (err, exists) {
    if (exists) return cb(null, { skip: true, entry: entry });

    archive.unpack({
      'output-directory': base,
      'files': [ entry ]
    }, function (err) {
      cb(null, {
        skip: false,
        entry: entry,
        outputFile: outputFile
      });
    });
  });
}

function itemExists (entry, cb) {
  fs.stat(entry, function (err, file) {
    return cb(err, file && file.isFile());
  });
}

function uniquePerBasename (entries) {
  var existing = [];
  return entries.filter(function (e) {
    var base = path.dirname(e);
    var hasEntry = existing.indexOf(base) !== -1;
    if (hasEntry) return false;
    existing = existing.concat(base);
    return true;
  })
}

function normalisePath (path) {
  return path.replace(/ /g, '\\ ');
}

function minutesToMs (m) {
  return m * 60 * 1000;
}
