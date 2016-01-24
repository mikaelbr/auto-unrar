#!/usr/bin/env node

var autoUnrar = require('../');

var commandLineArgs = require('command-line-args');

var cli = commandLineArgs([
  { name: 'help', alias: 'h', type: Boolean, description: 'Display this usage info' },
  { name: 'verbose', alias: 'v', type: Boolean, description: 'Log all information' },
  { name: 'cwd', type: String, defaultOption: true,
    defaultValue: process.cwd(),
    description: 'What folder to use as base directory (root search directory)' },
  // { name: 'no-listen', alias: 'n', type: Boolean,
  //   description: 'Deactivate watching on file system.'
  // },
  { name: 'interval', alias: 'i', type: Number, defaultValue: 5,
    description: 'Set interval in minutes for periodic check. Default value is 5 minutes.' }
]);

var usageOptions = {
  title: 'auto-unrar',
  description: 'Automatic unpack all recursive rar-files from a directory.',
  footer: 'Full help (project repo): [underline]{https://github.com/mikaelbr/auto-unrar}'
};

var options = cli.parse();

if (options.help) {
  console.log(cli.getUsage(usageOptions));
  process.exit(0);
}

// if (options.periodic === null) {
//   options.periodic = defaultPeriodicMinutes;
// }

runRecursive();

// if (!!options.periodic) {
//   runRecursive();
// }
//
// if (!options['no-listen']) {
//   startListening();
// }


function runRecursive () {
  log('Starting unpacking from', options.cwd);
  autoUnrar(options.cwd, function (err, data) {
    console.log(err, data);
  });
  setTimeout(runRecursive, minutesToMs(options.interval));
}

// function startListening () {
//   log('Listening on rar-files from', options.cwd);
//   autoUnrar.listen(options.cwd, function (err, data) {
//     console.log(err, data);
//   }, function () {
//     log('Unpacking triggered from listening on', options.cwd);
//   });
// }

function toList (arg) {
  return [].slice.apply(arg);
}

function log () {
  console.log.apply(console, [new Date().toISOString()].concat(toList(arguments)));
}

function minutesToMs (m) {
  return m * 60 * 1000;
}
