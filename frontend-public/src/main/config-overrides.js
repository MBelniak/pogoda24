const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const resolve = require('path').resolve;


module.exports = function override(config, env) {
   config.plugins = [
       new HtmlWebPackPlugin({
           template: "./public/index.html",
           filename: "./index.html",
           stats: { children: false }
       }),
       new MiniCssExtractPlugin(
           {
               filename: "[name].css"
           })
   ];

    config.resolve = {
        modules: [
            'src',
            'node_modules'
        ],
        symlinks: true,
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.css']
    };

    config.module = {
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
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            path: resolve('dist')
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[local]'
                            }
                        }
                    }
                ],
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                loader: "file-loader?name=/img/[name].[ext]"
            }
        ]
    };

    return config;
};