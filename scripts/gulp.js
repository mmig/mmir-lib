
var gulp = require('gulp');
var eclint = require('eclint');
var reporter = require('gulp-reporter');
// var path = require('path');
var fs = require('fs');

var root = '../';

var src = [
	root + 'lib/**/*.js',
	'!' + root + 'lib/vendor/libs',
	'!' + root + 'lib/vendor/libs/**',
	'!' + root + 'lib/mvc/parser/gen',
	'!' + root + 'lib/mvc/parser/gen/**'
];

var reportFile = root + 'editorconfig-report.log';
var testDest = root + 'fixed';
var fixDest = root + 'lib';

/** show editorconfig report */
gulp.task('check', function() {
  return gulp.src(src)
		.pipe(eclint.check())
		.pipe(reporter());
});

/** write editorconfig report */
gulp.task('report', function() {
  return gulp.src(src)
		.pipe(eclint.check())
		.pipe(reporter({output: fs.createWriteStream(reportFile, 'utf8')}));
});

/** test editorconfig-fix by writing files into sub-dir /fixed/** */
gulp.task('test', function() {
  return gulp.src(src)
		.pipe(eclint.fix())
		.pipe(gulp.dest(testDest));
});

/** fix with editorconfig-settings in-place */
gulp.task('fix', function() {
  return gulp.src(src)
		.pipe(eclint.fix())
		.pipe(gulp.dest(fixDest));
});
