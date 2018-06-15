'use strict';

var gulp = require('gulp');

var fs = require('fs');
var path = require('path');
var gutil = require('gulp-util');

var concat = require('gulp-concat');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

module.exports = function(options) {
  gulp.task('partials', function () {
    return gulp.src([
      options.src + '/src/**/*.html',
    //   options.tmp + '/serve/app/**/*.html'
    ])
      .pipe($.minifyHtml({
        empty: true,
        spare: true,
        quotes: true
      }))
      .pipe($.angularTemplatecache('lets-tpls.js', {
        module: 'letsAngular',
        root: 'lets'
      }))
      .pipe(gulp.dest(options.dist))
      .pipe($.size({ title: options.dist + '/', showFiles: true }));
  });

  gulp.task('scripts', function () {

    // var jsFilter = $.filter('**/*.js', {restore: true});

    return gulp.src([
        options.src + '/src/**/*.js'
      ])
      .pipe($.size({ title: options.src + '/', showFiles: true }))
      .pipe($.angularFilesort())
      
      .pipe($.ngAnnotate())
      .pipe($.useref())
      .pipe(concat('lets-core.js'))
      .pipe(gulp.dest(options.dist + '/'))
      .pipe($.uglify({ preserveComments: $.uglifySaveLicense, mangle: { except: ["$super"] }})).on('error', options.errorHandler('Uglify'))
      .pipe(concat('lets-core.min.js'))
      .pipe(gulp.dest(options.dist + '/'))
      .pipe($.size({ title: options.dist + '/', showFiles: true }));

      
  });

  gulp.task('full', ['scripts', 'partials'], function() {
    return gulp.src([
        options.dist + '/lets-core.js',
        options.dist + '/lets-tpls.js',
      //   options.tmp + '/serve/app/**/*.html'
      ])
      .pipe(concat('lets.min.js'))
      .pipe($.uglify({ preserveComments: $.uglifySaveLicense, mangle: { except: ["$super"] }})).on('error', options.errorHandler('Uglify'))
      .pipe(gulp.dest(options.dist + '/'))
      .pipe($.size({ title: options.dist + '/', showFiles: true }));
  });

//   gulp.task('other', function () {
//     return gulp
      
//   });

  gulp.task('clean', function (done) {
    $.del([options.dist + '/', options.tmp + '/'], done);
  });

  gulp.task('build', ['full']);
};
