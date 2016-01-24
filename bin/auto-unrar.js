#!/usr/bin/env node

var autoUnrar = require('../');
var chalk = require('chalk');
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

console.log('=>', chalk.blue('Started polling folder `' +
  chalk.underline(options.cwd) + '` every ' +
  chalk.green(options.interval) + ' minutes'));
runRecursive();

function runRecursive () {
  console.log('=>', chalk.blue('Starting unpacking from'), chalk.blue.underline(options.cwd));
  autoUnrar(options.cwd, function (err, data) {
    Object.keys(data).forEach(function (archive) {
      var entry = data[archive];
      if (entry.skip) {
        console.log(
          chalk.yellow('Skipped archive `' +
           chalk.underline(archive) + '`, as it\'s already unpacked')
        );
      } else {
        console.log(
          chalk.green('Extracted archive `' +
            chalk.underline(archive) +
            '` to: \n\t\t\t ≈>`' +
            chalk.underline(entry.outputFile)+'`')
        );
      }
    });
  });
  setTimeout(runRecursive, minutesToMs(options.interval));
}

function minutesToMs (m) {
  return m * 60 * 1000;
}
