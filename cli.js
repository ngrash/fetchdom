#!/usr/bin/env node

var program = require('commander');
var package = require('./package.json');

program
  .arguments('<url>')
  .description(package.description)
  .version(package.version)
  .option('-s, --save-image <path>', 'write PNG screenshot to <path>')
  .action(run)
  .parse(process.argv);

if(!process.argv.slice(2).length) {
  program.outputHelp();
}

function run(url) {
  var path = require('path');
  var childProcess = require('child_process');
  var phantomjs = require('phantomjs-prebuilt');
  var binPath = phantomjs.path;

  var options = {}
  if(program.saveImage) {
    options.saveImage = program.saveImage;
  }

  var childArgs = [
    path.join(__dirname, 'fetchdom.js'),
    url,
    btoa(JSON.stringify(options))
  ]

  var child = childProcess.spawn(binPath, childArgs);
  child.stdout.on('data', function(data) {
    process.stdout.write(data);
  });
  child.stderr.on('data', function(data) {
    process.stderr.write(data);
  })
  child.on('close', function(code) {
    if(code !== 0) {
      process.stderr.write("WARN: child process exited with non-zero code: " + code);
    }
  });
}

function btoa(str) {
  return new Buffer(str.toString(), 'binary').toString('base64');
}
