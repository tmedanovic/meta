'use strict';

/**
 * Gulp helpers & dependencies
 */
var gulp = require('gulp'),
    $ = require('gulp-load-plugins')({
        pattern: [
            'gulp-*',
            'rimraf',
            'webpack',
            'webpack-stream'
        ]
    }),
    $$ = require('./helpers');;

/**
 * Define tasks
 */
var tasks = {};

/**
 * Clean file(s)
 */
var clean = {
    'temp': function (done) {
        $.rimraf('./temp', done);
    },
    'bundles': function (done) {
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

/**
 * AoT compilation
 */
var ts = {
    compile: function(done) {
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
    },
    lint: function(done) {
        return gulp.src([
                './index.ts',
                './src/**/*.ts',
                '!./src/**/*.d.ts',
                './testing/**/*.ts',
                '!./testing/**/*.d.ts'
            ])
            .pipe($.tslint({ formatter: 'verbose' }))
            .pipe($.tslint.report({ emitError: false }))
            .on('end', done);
    }
};

ts.compile.displayName = 'compile:ngc';
ts.lint.displayName = 'tslint';

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

var tslint = function (done) {
    return gulp.src([
            './index.ts',
            './src/**/*.ts',
            '!./src/**/*.d.ts'
    ])
        .pipe($.tslint({ formatter: 'verbose' }))
        .pipe($.tslint.report({ emitError: false }))
        .on('end', done);
}

tslint.displayName = 'tslint';

/**
 * Bundle
 */
var bundle = {
    webpack: function (done) {
        const conf = require('./webpack.prod.js');

        return gulp.src('./index.ts')
            .pipe($.webpackStream(conf, $.webpack))
            .pipe(gulp.dest('./bundles'))
            .on('end', done);
    }
};

bundle.webpack.displayName = 'bundle:webpack';

/**
 * Tests
 */
var tests = {
    run: function(done) {
        const server = require('karma').Server;

        new server({
                configFile: $$.root('./karma.conf.js'),
                singleRun: true
            },
            function() {
                done();
                process.exit(0);
            }).start();
    }
}

tests.run.displayName = 'tests:run';

/**
 * Tasks
 */
tasks.clean = clean;
tasks.ts = ts;
tasks.bundle = bundle;
tasks.tests = tests;

/**
 * Task: __CLEAN__
 */
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

/**
 * Task: make
 */
gulp.task('make',
    gulp.series(
        '__CLEAN__',
        tasks.ts.compile,
        tasks.bundle.webpack
    ));

/**
 * Task: _TEST_
 */
gulp.task('_TEST_',
    gulp.series(
        tasks.tests.run
    ));

/**
 * Task: review:ts
 */
gulp.task('review:ts',
    gulp.series(
        tasks.ts.lint
    ));