const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');
const resolve = require('path').resolve;
const dotenv = require('dotenv').config();

module.exports = {
    entry: "./src/index.tsx",
    output: {
        path: resolve('dist'),
        filename: `bundle${process.env.NODE_ENV === 'production' ? '.min' : ''}.js`,
        publicPath: '/admin'
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
        minimize: process.env.NODE_ENV === 'production',
        minimizer: [new TerserPlugin()]
    },
    devServer: {
        proxy: {
            '/api/': 'http://localhost:8080',
            '/login': 'http://localhost:8080',
            '/admin/': {
                    target: 'http://localhost:3001/',
                    pathRewrite: { '^/admin': '' },
                },
        },
        port: 3001,
        historyApiFallback: true,
        watchContentBase: true,
        contentBase: resolve('src'),
        publicPath: '/',
        contentBasePublicPath: '/'
    },
    mode: process.env.NODE_ENV,
    devtool: process.env.NODE_ENV === 'production' ? false : 'eval-source-map',
    resolve: {
        modules: [
            'src',
            'node_modules'
        ],
        symlinks: true,
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.css'],
        alias: {
            react: resolve('./node_modules/react')
        }
    },
    module: {
        rules: [
            {
                test: /\.ts(x)?$/,
                loader: 'babel-loader',
                query: {
                    presets: ['@babel/preset-env', '@babel/preset-react'],
                    plugins: ["emotion"]
                },
            },
            {
                test: /\.ts(x)?$/,
                loader: 'ts-loader',
            },
            {
                test: /\.(s)?css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[local]'
                            }
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: process.env.NODE_ENV === 'production'
                        }
                    }
                ],
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                loader: "file-loader?name=/img/[name].[ext]",
                options: {
                    publicPath: '/admin'
                }
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./public/index.html",
            filename: "./index.html",
            stats: { children: false },
            favicon: "./public/favicon.png"
        }),
        new MiniCssExtractPlugin(
            {
                filename: "css/main.css"
            }),
        new webpack.DefinePlugin ({
            "process.env": JSON.stringify(dotenv.parsed)
        }),
        // Ignore all locale files of moment.js
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new LodashModuleReplacementPlugin(),
        // new BundleAnalyzerPlugin()
    ]
};