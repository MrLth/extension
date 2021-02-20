/* eslint-disable @typescript-eslint/no-var-requires */
/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-05-27 15:30:26
 * @LastEditTime: 2021-02-20 17:44:16
 * @Description: file content
 */
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');


// const threadLoader = require('thread-loader');
// threadLoader.warmup({
//   workers: require('os').cpus().length - 1,
//   poolTimeout: Infinity
// }, ['babel-loader']);


const __DEV__ = process.env.NODE_ENV !== 'production'

const entry = {
  newtab: resolve('src/pages/newtab/index.tsx'),
  popup: resolve('src/pages/popup/index.tsx'),
}

const htmlWebpackPluginList = Object.keys(entry).map(key =>
  new HtmlWebpackPlugin({
    inject: true,
    chunks: [key],
    filename: `${key}.html`,
    template: __DEV__ ? './template/dev.html' : './template/prod.html'
  })
)

module.exports = {
  entry,
  output: {
    path: resolve(__dirname, 'dist'),
    filename: '[name].[contenthash:8].bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      ...__DEV__ ? { 'react-dom': '@hot-loader/react-dom', } : {},
      "@img": resolve("public/img"),
      'public': resolve("public"),
      'components': resolve("src/components"),
      'utils': resolve("src/utils"),
      'config': resolve("config"),
      'models': resolve("src/models"),
      'src': resolve("src")
    },
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          // 'thread-loader',
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          }
        ]
      },
      {
        test: /\.(jpeg|jpg|img|gif|svg)$/,
        type: 'asset',
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

    ...htmlWebpackPluginList,

    new CopyWebpackPlugin({
      patterns: [
        { from: './manifest.json' }
      ]
    }),

    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: resolve('tsconfig.json'),
        profile: !__DEV__
      },
    }),

    new (require("friendly-errors-webpack-plugin")),

    new (require('webpackbar')),
  ]
}