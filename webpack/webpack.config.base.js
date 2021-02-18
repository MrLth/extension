/* eslint-disable @typescript-eslint/no-var-requires */
/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-05-27 15:30:26
 * @LastEditTime: 2021-02-18 17:04:15
 * @Description: file content
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

// 解析命令行参数
// const argv = require('minimist')(process.argv.slice(2))

const entry = {
    newtab: path.resolve('src/pages/newtab/index.tsx'),
    popup: path.resolve('src/pages/popup/index.tsx'),
}


console.log('entry', entry)

module.exports = {
    mode: "production",
    entry,
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].[contenthash:8].bundle.js',
        publicPath: '/'
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
            'config': path.resolve("config"),
            'models': path.resolve("src/models"),
            'src': path.resolve("src")
        }
    },
    optimization: {
        minimize: false,
        splitChunks: {
            // 对所有的包进行拆分
            chunks: 'all',
            maxInitialRequests: 4,
            // minSize: 0,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module) {
                        // 获取第三方包名
                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                        // npm 软件包名称是 URL 安全的，但是某些服务器不喜欢@符号
                        return `npm.${packageName.replace('@', '')}`;
                    },
                },
            },
        },
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
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: ['autoprefixer']
                            }
                        }
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            },
            {
                test: /\.(jpeg|jpg|img|gif|svg)$/,
                // 通用资源类型
                type: 'asset',
                // 现在，webpack 将按照默认条件，自动地在 resource 和 inline 之间进行选择：
                // 小于 8kb 的文件，将会视为 inline 模块类型，否则会被视为 resource 模块类型。
                // 自定义设置
                parser: {
                    dataUrlCondition: {
                        maxSize: 8 * 1024
                    }
                }
            }
        ]
    },

    plugins: [
        new CleanWebpackPlugin(),

        new HtmlWebpackPlugin({
            inject: true,
            chunks: ['newtab'],
            filename: 'newtab.html',
            template: './template/newtab.html'
        }),
        ...entry.popup
            ? [new HtmlWebpackPlugin({
                inject: true,
                chunks: ['popup'],
                filename: 'popup.html',
                template: './template/newtab.html'
            })]
            : [],
        new CopyWebpackPlugin({
            patterns: [
                { from: './config/manifest.json' },
                { from: './public/asset/react-dom.production.min.js' },
                { from: './public/asset/react.production.min.js' }
            ]
        }),
        //多线程压缩
        new ParallelUglifyPlugin({
            exclude:/min.js$/,
            terser: true,
        }),
        // new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    ],
    externals: {
        react: "React",
        "react-dom": "ReactDOM"
    }
};