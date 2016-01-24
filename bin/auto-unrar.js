#!/usr/bin/env node

var autoUnrar = require('../');
var commandLineArgs = require('command-line-args');

var cli = commandLineArgs([
  { name: 'help', alias: 'h', type: Boolean, description: 'Display this usage info' },
  { name: 'verbose', alias: 'v', type: Boolean, description: 'Log all information' },
  { name: 'cwd', type: String, defaultOption: true,
    defaultValue: process.cwd(),
    description: 'What folder to use as base directory (root search directory)' },
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

console.log('Started polling folder `' +
  options.cwd + '` every ' +
  options.interval + ' minutes');
runRecursive();

function runRecursive () {
  console.log('Starting unpacking from', options.cwd);
  autoUnrar(options.cwd, function (err, data) {
    console.log(err, data);
  });
  setTimeout(runRecursive, minutesToMs(options.interval));
}

function minutesToMs (m) {
  return m * 60 * 1000;
}
