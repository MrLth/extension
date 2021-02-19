/* eslint-disable @typescript-eslint/no-var-requires */
/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-05-27 15:30:26
 * @LastEditTime: 2021-02-19 15:13:07
 * @Description: file content
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HappyPack = require('happypack')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

// 解析命令行参数, 但是配合 webpack-cli 会报错
// const argv = require('minimist')(process.argv.slice(2))

// const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
// const smp = new SpeedMeasurePlugin();

const entry = {
    newtab: path.resolve('src/pages/newtab/index.tsx'),
    popup: path.resolve('src/pages/popup/index.tsx'),
}

console.log('entry', entry)

module.exports = /*smp.wrap(*/{
    mode: "production",
    entry,
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].[contenthash:8].bundle.js',
        publicPath: '/'
    },
    resolve: {
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
            chunks: 'all',
            // 被多次引入的包会优先分出来，不受 maxInitialRequests 限制
            maxInitialRequests: 4,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module) {
                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                        // npm 软件包名称是 URL 安全的，但是某些服务器不喜欢@符号
                        return `npm.${packageName.replace('@', '')}`;
                    },
                },
            }
        },
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'thread-loader',
                        options: {
                            // there should be 1 cpu for the fork-ts-checker-webpack-plugin
                            workers: require('os').cpus().length - 1,
                            poolTimeout: Infinity // set this to Infinity in watch mode - see https://github.com/webpack-contrib/thread-loader
                        },
                    },
                    {
                        loader: "ts-loader",
                        options: {
                            happyPackMode: true // IMPORTANT! use happyPackMode mode to speed-up compilation and reduce errors reported to webpack
                        }
                    }
                ]
            },
            {
                test: /\.s?css$/,
                use: [
                    //#region style-loader 与 MiniCssExtractPlugin 无法同时使用,并且 MiniCssExtractPlugin 无法用于 HMR ，最好只用于生产环境
                    /** *
                    {
                        loader: 'style-loader'
                    },
                    /** */
                    //#endregion
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                auto: /\.(local|module|m)\.s?css$/
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
                parser: {
                    dataUrlCondition: {
                        maxSize: 8 * 1024
                    }
                }
            }
        ]
    },

    plugins: [
        new (require("clean-webpack-plugin").CleanWebpackPlugin),
        //#region HTML模板
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
        //#endregion
        new CopyWebpackPlugin({
            patterns: [
                { from: './config/manifest.json' },
                { from: './public/asset/react-dom.production.min.js' },
                { from: './public/asset/react.production.min.js' }
            ]
        }),
        // CSS 抽离
        new MiniCssExtractPlugin(),
        // CSS 压缩
        new CssMinimizerPlugin(),
        // 多线程压缩
        new ParallelUglifyPlugin({
            exclude: /min.js$/,
            terser: true,
        }),
        new ForkTsCheckerWebpackPlugin({
            typescript: {
                diagnosticOptions: {
                    semantic: true,
                    syntactic: true,
                },
            },
        }),
        new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    ],
    externals: {
        react: "React",
        "react-dom": "ReactDOM"
    }
}//)