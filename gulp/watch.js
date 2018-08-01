'use strict';

var gulp = require('gulp');

function isOnlyChange(event) {
  return event.type === 'changed';
}

module.exports = function(options) {
  gulp.task('watch',function () {

    gulp.watch([
      'src/**/*.js',
      'src/**/*.html',
    ], function(event) {
      gulp.start('build');
    });
    
  });
};
