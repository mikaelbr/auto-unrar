var Unrar = require('unrar');
var glob = require('glob');
var path = require('path');
var fs = require('fs');
// var globwatcher = require('globwatcher').globwatcher;
var debounce = require('lodash.debounce');

module.exports = function (cwd, cb) {
  var opts = { cwd: cwd || process.cwd() };
  return unpackAll(opts, cb);
};

// module.exports.listen = function (cwd, cb, onTrigger) {
//   onTrigger = onTrigger || function () { };
//   var opts = {
//     cwd: cwd || process.cwd(),
//     emitFolders: true
//   };
//
//   var watcher = globwatcher('./', opts);
//   watcher.on('added', function (filename) {
//     onTrigger(filename);
//     unpackAll(opts, cb);
//   });
//
//   // watcher.on('deleted', function (filename) {
//   //   console.log('deleted', filename);
//   // });
// };

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
  var archive = new Unrar(normalisePath(fullPath));

  archive.list(function (err, entries) {
    if (err) return cb(err);
    entries.forEach(unrarIfNotExists.bind(null, archive, base, cb));
  });
}

function unrarIfNotExists (archive, base, cb, entry) {
  var outputFile = path.join(base, entry.name);
  itemExists(outputFile, function (err, exists) {
    if (exists) return cb(null, { skip: true, entry: entry });

    return cb(null, {
      skip: false, entry: entry,
      stream: archive.stream(entry.name).pipe(fs.createWriteStream(outputFile)),
      outputFile: outputFile
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
