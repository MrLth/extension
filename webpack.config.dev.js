/* eslint-disable @typescript-eslint/no-var-requires */
/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-05-27 15:30:26
 * @LastEditTime: 2021-02-19 16:29:31
 * @Description: file content
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
// const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const threadLoader = require('thread-loader');
threadLoader.warmup({
  // there should be 1 cpu for the fork-ts-checker-webpack-plugin
  workers: require('os').cpus().length - 1,
  poolTimeout: Infinity
}, ['ts-loader']);


const entry = {
  newtab: path.resolve('src/pages/newtab/index.tsx'),
  // popup: path.resolve('src/pages/popup/index.tsx'),
}

console.log('entry', entry)

module.exports = {
  mode: "development",
  entry,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash:8].bundle.js',
  },
  devtool: "inline-cheap-source-map",
  cache: { type: 'filesystem' },
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
    },
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'thread-loader'
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
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: /\.(local|module|m)\.s?css$/
              }
            }
          },
          'sass-loader'
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
      template: './template/dev.html'
    }),
    ...entry.popup
      ? [new HtmlWebpackPlugin({
        inject: true,
        chunks: ['popup'],
        filename: 'popup.html',
        template: './template/dev.html'
      })]
      : [],
    //#endregion
    new CopyWebpackPlugin({
      patterns: [
        { from: './config/manifest.json' }
      ]
    }),
    // CSS 抽离
    new MiniCssExtractPlugin(),
    // thread-load 配合 ts-loader 需要关闭类型验证，作为弥补，以下 plugin 将使用额外一个进程进行类型验证
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
      },
    }),
  ]
}