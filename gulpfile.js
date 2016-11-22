'use strict';

// Include dependencies
var gulp = require('gulp'),
    $ = require('gulp-load-plugins')({
        pattern : [
            'gulp-*',
            'rimraf',
            'webpack',
            'webpack-stream'
        ]
    });

// Clean file(s)
var clean = {
    'temp' : function(done) {
        $.rimraf('./temp', done);
    },
    'bundles' : function(done) {
        $.rimraf('./bundles', done);
    },
    'index.js': function (done) {
        $.rimraf('./index.js', done);
    },
    'index.d.ts': function (done) {
        $.rimraf('./index.d.ts', done);
    },
    'index.metadata.json': function (done) {
        $.rimraf('./index.metadata.json', done);
    },
    'src/*.js': function (done) {
        $.rimraf('./src/**/*.js', done);
    },
    'src/*.d.ts': function (done) {
        $.rimraf('./src/**/*.d.ts', done);
    },
    'src/*.metadata.json': function (done) {
        $.rimraf('./src/**/*.metadata.json', done);
    }
};

clean['temp'].displayName = 'clean:./temp/**';
clean['bundles'].displayName = 'clean:./bundles/**';
clean['index.js'].displayName = 'clean:./index.js';
clean['index.d.ts'].displayName = 'clean:./index.d.ts';
clean['index.metadata.json'].displayName = 'clean:./index.metadata.json';
clean['src/*.js'].displayName = 'clean:./src/*.js';
clean['src/*.d.ts'].displayName = 'clean:./src/*.js';
clean['src/*.metadata.json'].displayName = 'clean:./src/*.js';

//*** __CLEAN__
gulp.task('__CLEAN__',
    gulp.parallel(
        clean['temp'],
        clean['bundles'],
        clean['index.js'],
        clean['index.d.ts'],
        clean['index.metadata.json'],
        clean['src/*.js'],
        clean['src/*.d.ts'],
        clean['src/*.metadata.json']
    ));

// AoT compilation
var compile = function (done) {
    const options = {
        continueOnError: false,
        pipeStdout: false,
        customTemplatingThing: 'test'
    };
    const reportOptions = {
        err: true,
        stderr: true,
        stdout: true
    };

    return gulp.src('./tsconfig.json')
      .pipe($.exec('ngc -p "./tsconfig.json"', options))
      .pipe($.exec.reporter(reportOptions))
      .on('end', done);
}

compile.displayName = 'compile:ngc';

// Webpack bundle
var bundle = function (done) {
    const conf = require('./webpack.config.js');

    return gulp.src('./index.ts')
                .pipe($.webpackStream(conf, $.webpack))
                .pipe(gulp.dest('./bundles'))
                .on('end', done);
}

bundle.displayName = 'bundle:webpack';

//*** make
gulp.task('make',
    gulp.series(
        '__CLEAN__',
        compile,
        bundle
    ));
