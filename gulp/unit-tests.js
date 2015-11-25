'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var karma = require('karma');

function runTests (singleRun, done) {
  var reporters, preprocessors;

  if (singleRun) {
    reporters = ['progress', 'coverage'];
    preprocessors = {
      'src/**/*.html': ['ng-html2js'],
      'src/**/*.directive.js': ['coverage'],
      'src/**/*.service.js': ['coverage'],
      'src/**/*.controller.js': ['coverage'],
      'src/**/*.provider.js': ['coverage'],
      'src/*.js': ['coverage']
    };
  } else {
    reporters = ['nyan'];
    preprocessors = {
      'src/**/*.html': ['ng-html2js']
    };
  }

  karma.server.start({
    configFile: path.join(__dirname, '/../karma.conf.js'),
    singleRun: singleRun,
    autoWatch: !singleRun,
    reporters: reporters,
    preprocessors: preprocessors
  }, function(exitCode) {
    done(exitCode ? new Error('Karma has exited with ' + exitCode) : null);
  });
}

gulp.task('test', ['scripts'], function(done) {
  runTests(true, done);
});

gulp.task('test:auto', ['watch'], function(done) {
  runTests(false, done);
});
