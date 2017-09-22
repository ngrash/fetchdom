#!/usr/bin/env node

var program = require('commander');

program
  .arguments('<url>')
  .option('-s --save-image <path>', 'Write PNG screenshot to <path>')
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

  var childArgs = [
    path.join(__dirname, 'renderdom.js'),
    url
  ]

  if(program.saveImage) {
    childArgs.push(program.saveImage)
  }

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
