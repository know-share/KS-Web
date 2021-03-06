var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {

    entry: {
        'app': './src/main.ts',
        'polyfills': [
            'core-js/es6',
            'core-js/es7/reflect',
            'zone.js/dist/zone'
        ]
    },
    output: {
        path: './dist',
        filename: '[name].[hash].js'
    },
    module: {
        loaders: [
            { test: /\.component.ts$/, loader: 'ts!angular2-template' },
            { test: /\.ts$/, exclude: /\.component.ts$/, loader: 'ts' },
            { test: /\.html$/, loader: 'raw' },
            { test: /\.css$/, include: path.resolve('src/app'), loader: 'raw' },
            { test: /\.css$/, exclude: path.resolve('src/app'), loader: ExtractTextPlugin.extract('style', 'css') },
            { test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/, loader: 'file?name=fonts/[name].[ext]' }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.ts', '.html', '.css']
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'polyfills'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new webpack.DefinePlugin({
            app: {
                environment: JSON.stringify(process.env.APP_ENVIRONMENT || 'development')
            }
        }),
        new ExtractTextPlugin('[name].css'),
        new CopyWebpackPlugin([{
            from: './src/resources/images',
            to: './images'
        },{
            from: './src/resources/css',
            to: './css'
        },{
            from: './node_modules/primeng',
            to: './css'
        },{
            from:'./node_modules/font-awesome',
            to: './fonts'
        },{
            from:'./src/resources/info',
            to:'./info'
        },{
			from: './node_modules/chart.js/dist',
			to:'./chart.js'
		},{
            from: './node_modules/angular2-busy/build/style/busy.css',
            to: './css'
        }])
    ]

};