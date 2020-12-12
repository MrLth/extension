/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-05-27 15:30:26
 * @LastEditTime: 2020-12-12 10:36:18
 * @Description: file content
 */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require("clean-webpack-plugin")

module.exports = {
    // mode: "production",
    mode: "development",
    entry: {
        newtab: './src/pages/newtab/index.tsx',
        popup: './src/pages/popup/index.tsx',
        // content: './src/extension/newtab/content.ts',
        // background: './src/extension/newtab/background.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    // Enable sourcemaps for debugging webpack's output.
    devtool: "inline-cheap-source-map",
    // devtool: "inline-source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js"],
        alias: {
            "@img": path.resolve("public/img"),
            'public': path.resolve("public"),
            'components': path.resolve("src/components"),
            'utils': path.resolve("src/utils"),
            'hooks': path.resolve("src/hooks"),
            'models': path.resolve("src/models"),
            'common': path.resolve("src/common"),
            'types': path.resolve("src/types"),
            'store': path.resolve("src/store"),
            'src': path.resolve("src")
        }
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader"
                    }
                ]
            },
            //  All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            },
            {
                test: /\.s?css$/,
                use: [
                    {
                        loader: 'style-loader'
                    }, {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                auto: /\.(local|module|m)\.s?css$/,
                                localIdentName: '[folder]__[local]__[hash:base64:5]',
                            }
                        }
                    }, {
                        loader: 'sass-loader'
                    }
                ]
            },
            {
                test: /\.(jpeg|jpg|img|gif|svg)$/,
                use: [
                    // 'file-loader',
                    'url-loader?limit=8192'
                ]
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            chunks: ['newtab'],
            filename: 'newtab.html',
            template: './template/newtab.html'
        }),
        new HtmlWebpackPlugin({
            inject: true,
            chunks: ['popup'],
            filename: 'popup.html',
            template: './template/newtab.html'
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: './src/manifest.json' },
                { from: './public/asset/react-dom.production.min.js' },
                { from: './public/asset/react.production.min.js' }
            ]
        }),
        // new CleanWebpackPlugin()
    ],
    externals: {
        react: "React",
        "react-dom": "ReactDOM"
    }
};