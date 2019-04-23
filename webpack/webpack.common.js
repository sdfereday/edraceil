const autoprefixer = require('autoprefixer');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

const CSSLoader = {
    loader: 'css-loader',
    options: {
        modules: false, // to true when parsing CSS modules
        sourceMap: false,
        localIdentName: '[local]__[hash:base64:5]'
    }
}

const postCSSLoader = {
    loader: 'postcss-loader',
    options: {
        ident: 'postcss',
        sourceMap: false,
        plugins: () => [
            autoprefixer({
                browsers: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9']
            })
        ]
    }
}

module.exports = {
    // devtool: 'source-map',
    mode: 'development', // 'production'
    entry: './src/index.js',
    output: {
        publicPath: '/dist/', // Required for hot-reloading, points to public path of built assets (memory or otherwise).
        path: path.resolve(__dirname, '../public/dist'), // Physical directory that all built assets end up (after manual build).
        filename: 'bundle.js' // The filename of the app that gets populated on build, assets placed around it (after manual build).
    },
    module: {
        rules: [
            {
                test: require.resolve('kontra'),
                use: 'exports-loader?kontra'
            },
            {
                test: /\.(js|jsx)$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                query: {
                    "presets": [
                        "@babel/preset-env",
                        // "@babel/preset-react"
                    ],
                    "plugins": [
                        ["@babel/transform-runtime"]
                    ]
                }
            },
            {
                test: /\.(scss|css)$/,
                exclude: /\.module\.scss$/,
                use: [
                    'style-loader',
                    CSSLoader,
                    postCSSLoader,
                    'sass-loader'
                ]
            },
            {
                test: /\.(svg)?$/,
                exclude: /node_modules/,
                use: 'url-loader?limit=10000',
            },
            {
                test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                exclude: /node_modules/,
                use: 'url-loader?limit=10000',
            },
            {
                test: /\.(ttf|eot)(\?[\s\S]+)?$/,
                exclude: /node_modules/,
                use: 'file-loader',
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'style.css'
        }),
        new WebpackNotifierPlugin({
            title: 'Webpack',
            excludeWarnings: true,
            alwaysNotify: true
        })
    ],
    optimization: {
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: false,
                terserOptions: {}
            }),
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                    map: {
                        inline: false
                    }
                }
            })
        ]
    },
    devServer: { // Virtual location to run server from.
        contentBase: path.join(__dirname, '../public/'),
        hot: true,
        host: '0.0.0.0',
        port: 4000,
        historyApiFallback: true
    }
};