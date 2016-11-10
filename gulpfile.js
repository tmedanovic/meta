'use strict';

// Include dependencies
var gulp = require('gulp'),
    $ = require('gulp-load-plugins')({
        pattern : [
            'gulp-*',
            'lazypipe',
            'rimraf'
        ]
    });

// Helpers
var debug = function (glob) {
    return $.lazypipe()
        .pipe(function() {
            return $.debug({ title : '' });
        })
        .pipe(function() {
            return $.ignore.exclude(!!glob ? glob : '*.*');
        })
        .pipe(function() {
            return gulp.dest('./temp');
        })();
}

var tslint = function () {
    return $.lazypipe()
        .pipe(function() {
            return $.tslint({ formatter : 'verbose' });
        })
        .pipe(function() {
            return $.tslint.report({ emitError : false });
        })();
}

// Clean file(s)
var clean = {
    'temp' : function(done) {
        $.rimraf('./temp', done);
    },
    'build' : function(done) {
        $.rimraf('./build', done);
    },
    'dist' : function(done) {
        $.rimraf('./dist', done);
    }
};

clean['temp'].displayName = 'clean:./temp/**';
clean['build'].displayName = 'clean:./build/**';
clean['dist'].displayName = 'clean:./dist/**';

// TypeScript
var ts = {
    'ng2-metadata' : {
        compile : function(done) {
            var tsProject = $.typescript.createProject('./tsconfig.json'),
                tsResult = gulp.src('./src/**/*.ts')
                    .pipe($.changed('./build', { extension : '.js' }))
                    .pipe(tsProject());

            return tsResult.js
                .pipe(gulp.dest('./build'))
                .pipe(debug('**/*.*'))
                .on('end', done);
        },
        bundle : function(done) {
            var ignoreDeps = {};
            ignoreDeps['./node_modules/@angular/*'] = { build : false };
            ignoreDeps['./node_modules/rxjs/*'] = { build : false };

            var builder = $.systemjsBuilder();

            builder.config({
                paths : { '*' : '*.js' },
                map : {
                    '@angular/common' : './node_modules/@angular/common/bundles/common.umd.min.js',
                    '@angular/core' : './node_modules/@angular/core/bundles/core.umd.min.js',
                    '@angular/platform-browser' : './node_modules/@angular/platform-browser/bundles/platform-browser.umd.min.js',
                    '@angular/router' : './node_modules/@angular/router/bundles/router.umd.min.js',
                    'rxjs' : './node_modules/rxjs'
                },
                meta : ignoreDeps
            });

            return builder.buildStatic('./build/index.js',
                    'ng2-metadata.umd.min.js',
                    {
                        minify : true,
                        format : 'umd'
                    })
                .pipe(gulp.dest('./dist'))
                .pipe(debug())
                .on('end', done);
        },
        lint : function(done) {
            return gulp.src('./src/**/*.ts')
                .pipe(tslint())
                .on('end', done);
        }
    }
};

ts['ng2-metadata'].compile.displayName = 'compile:ts';
ts['ng2-metadata'].bundle.displayName = 'bundle:ts';
ts['ng2-metadata'].lint.displayName = 'lint:ts';

//*** __CLEAN__
gulp.task('__CLEAN__',
    gulp.parallel(
        clean['temp'],
        clean['build'],
        clean['dist']
    ));

//*** _BUILD_
gulp.task('_BUILD_',
    gulp.parallel(
        ts['ng2-metadata'].compile
    ));

//*** _DIST_
gulp.task('_DIST_',
    gulp.parallel(
        ts['ng2-metadata'].bundle
    ));

//*** Review
gulp.task('review:ts',
    gulp.parallel(
        ts['ng2-metadata'].lint
    ));
