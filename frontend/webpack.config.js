const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');
const path = require('path');
const dotenv = require('dotenv').config();

module.exports = {
    entry: {
        main: "./src/public/src/index.tsx",
        admin: "./src/admin/src/index.tsx"
    },
    output: {
        path: path.resolve('dist'),
        filename: `[name].bundle${process.env.NODE_ENV === 'production' ? '.min' : ''}.js`,
        publicPath: '/'
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
        minimize: process.env.NODE_ENV === 'production',
        minimizer: [new TerserPlugin()]
    },
    devServer: {
        proxy: { '/api/': 'http://localhost:8080' },
        port: 3000,
        historyApiFallback: {
            rewrites: [
                { from: /^\/(writer?|traffic|factwriter|list|files)$/, to: '/admin.html'}
            ]
        },
        watchContentBase: true,
        contentBase: path.resolve('src')
    },
    mode: process.env.NODE_ENV,
    devtool: process.env.NODE_ENV === 'production' ? false : 'inline-module-source-map',
    resolve: {
        modules: [
            'src/admin',
            'src/public',
            'src/shared',
            'node_modules'
        ],
        symlinks: true,
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss'],
        alias: {
            "@shared": path.resolve('src/shared')
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
                    publicPath: '/'
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/public/public/index.html",
            filename: "./index.html",
            excludeChunks: ['admin', 'vendors~admin'],
            stats: { children: false },
            favicon: "./src/public/public/favicon.png"
        }),
        new HtmlWebpackPlugin({
            template: "./src/admin/public/index.html",
            filename: "./admin.html",
            excludeChunks: ['main', 'vendors~main'],
            stats: { children: false },
            favicon: "./src/admin/public/favicon.png"
        }),
        new webpack.HotModuleReplacementPlugin(),
        new MiniCssExtractPlugin(
        {
            filename: "css/[name].css"
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
