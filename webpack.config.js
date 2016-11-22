const helpers = require('./config/helpers'),
    webpack = require('webpack');

module.exports = {
    resolve : {
        extensions : ['.ts', '.js']
    },

    entry: helpers.root('index.ts'),

    output : {
        path : helpers.root('bundles'),
        publicPath : '/',
        filename : 'ng2-metadata.umd.min.js',
        libraryTarget : 'umd',
        library : 'ng2-metadata'
    },

    // require those dependencies but don't bundle them
    externals : [/^\@angular\//, /^rxjs\//],

    module : {
        rules: [{
            enforce: 'pre',
            test: /\.ts$/,
            loader: 'tslint-loader',
            exclude: [helpers.root('node_modules')]
        }, {
            test: /\.ts$/,
            loader: 'awesome-typescript-loader?declaration=false',
            exclude: [/\.e2e\.ts$/]
        }]
    },

    plugins : [
        // fix the warning in ./~/@angular/core/src/linker/system_js_ng_module_factory_loader.js
        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
            helpers.root('./src')
        ),

        new webpack.LoaderOptionsPlugin({
            options: {
                tslintLoader: {
                    emitErrors: false,
                    failOnHint: false
                }
            }
        }),

        new webpack.optimize.UglifyJsPlugin({ // https://github.com/angular/angular/issues/10618
            mangle : {
                keep_fnames : true
            }
        })
    ]
};