const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const resolve = require('path').resolve;

module.exports = {
    entry: "./src/index.tsx",
    output: {
        path: resolve('dist'),
        filename: 'bundle.js'
    },
    mode: "production",
    resolve: {
        modules: [
            'src',
            'node_modules'
        ],
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.ts(x)?$/,
                loader: 'babel-loader',
                query: {
                    presets: ['@babel/preset-env', '@babel/preset-react']
                },
            },
            {
                test: /\.ts(x)?$/,
                loader: 'ts-loader',
            },
            {
                test: /\.js(x)?$/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'react']
                },
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            path: resolve('dist')
                        }
                    },
                    'css-loader'
                ],
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                loader: "file-loader?name=/img/[name].[ext]"
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./public/index.html",
            filename: "./index.html",
            stats: { children: false }
        }),
        new MiniCssExtractPlugin(
            {
                filename: "[name].css"
            })
    ]
}