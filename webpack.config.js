/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-05-27 15:30:26
 * @LastEditTime: 2020-06-20 13:05:45
 * @Description: file content
 */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: "production",
    // mode: "development",

    // Enable sourcemaps for debugging webpack's output.
    // devtool: "source-map",

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
            // {
            //     enforce: "pre",
            //     test: /\.js$/,
            //     loader: "source-map-loader"
            // },
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
        new HtmlWebpackPlugin({ template: './index.html' })
    ],

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
        react: "React",
        "react-dom": "ReactDOM"
    }
};