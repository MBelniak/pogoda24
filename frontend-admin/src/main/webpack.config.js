const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const resolve = require('path').resolve;

module.exports = {
    entry: "./src/index.tsx",
    output: {
        path: resolve('dist'),
        filename: 'bundle.js',
        publicPath: '/admin'
    },
    devServer: {
        proxy: {
            '/api/': 'http://localhost:8080',
            '/admin/': {
                    target: 'http://localhost:3001/',
                    pathRewrite: { '^/admin': '' },
                },
        },
        port: 3001,
        historyApiFallback: true,
        watchContentBase: true,
        contentBase: resolve('dist'),
        publicPath: '/',
        contentBasePublicPath: '/'
    },
    mode: process.env.NODE_ENV,
    devtool: 'inline-module-source-map',
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
                            sourceMap: true
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
            })
    ]
};