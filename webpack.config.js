/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-05-27 15:30:26
 * @LastEditTime: 2020-08-24 21:44:55
 * @Description: file content
 */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')


module.exports = {
    // mode: "production",
    mode: "development",
    entry: {
        newtab: './src/newtab.tsx',
        popup: './src/popup.tsx',
        content: './src/content.ts',
        background: './src/background.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js"],
        alias: {
            "@store": path.resolve("src/store"),
            "@api": path.resolve("src/api"),
            "src": path.resolve("src"),
            "@img": path.resolve("public/img")
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
                test: /\.css$/,
                use: [
                    "style-loader", // 将 JS 字符串生成为 style 节点
                    "css-loader" // 将 CSS 转化成 CommonJS 模块
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader", // 将 JS 字符串生成为 style 节点
                    "css-loader", // 将 CSS 转化成 CommonJS 模块
                    "sass-loader" // 将 Sass 编译成 CSS，默认使用 Node Sass
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
        new HtmlWebpackPlugin({ template: './public/index.html' }),
        new CopyWebpackPlugin({
            patterns: [{ from: './src/manifest.json' }]
        })
    ],
    // externals: {
    //     react: "React",
    //     "react-dom": "ReactDOM"
    // }
};