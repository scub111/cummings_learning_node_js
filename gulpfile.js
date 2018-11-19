'use strict';

const gulp = require('gulp');
const mocha = require('gulp-mocha');
const env = require('gulp-env');
const istanbul = require('gulp-istanbul');

gulp.task('test', function() {
   env({vars: {NODE_ENV: 'test'}});
   return gulp.src('__test__/**/*.js').pipe(mocha());
});

gulp.task('instrument', function() {
   return gulp.src('src/**/*.js')
      .pipe(istanbul())
      .pipe(istanbul.hookRequire());
});

gulp.task('default', ['test', 'instrument'], function() {
   gulp.src('__test__/**/*.js')
      .pipe(istanbul.writeReports())
      .pipe(istanbul.enforceThresholds({
         thresholds: {global: 90}
      }));
});