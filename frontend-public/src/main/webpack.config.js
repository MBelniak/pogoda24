const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const resolve = require('path').resolve;
const dotenv = require('dotenv').config();

module.exports = {
    entry: "./src/index.tsx",
    output: {
        path: resolve('dist'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    devServer: {
        proxy: {
            '/api/': 'http://localhost:8080'
        },
        contentBase: resolve('src'),
        port: 3000,
        historyApiFallback: true,
        watchContentBase: true,
    },
    mode: process.env.NODE_ENV,
    devtool: 'inline-module-source-map',
    resolve: {
        modules: [
            'src',
            'node_modules'
        ],
        symlinks: true,
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.css']
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
                            sourceMap: true
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
        new HtmlWebPackPlugin({
            template: "./public/index.html",
            filename: "./index.html",
            stats: { children: false },
            favicon: "./public/favicon.png"
        }),
        new MiniCssExtractPlugin(
            {
                filename: "css/[name].css"
            }),
        new webpack.DefinePlugin({
            "process.env": JSON.stringify(dotenv.parsed)
        }),
    ]
};