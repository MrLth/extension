/* eslint-disable @typescript-eslint/no-var-requires */
/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-05-27 15:30:26
 * @LastEditTime: 2021-02-22 16:35:26
 * @Description: file content
 */
// const { resolve: _resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const Webpackbar = require('webpackbar');
const { DefinePlugin } = require('webpack')
const { readdirSync, statSync } = require('fs')
const tsConfig = require('../tsconfig.json')
const { resolve } = require('../server/config')

const { paths, baseUrl } = tsConfig.compilerOptions

const alias = {}
if (![undefined, '.', './'].includes(baseUrl)) {
  const baseUrlSubDirectoryList = readdirSync(resolve(baseUrl)).filter(
    (filename) => statSync(resolve(baseUrl, filename)).isDirectory(),
  )

  for (const directory of baseUrlSubDirectoryList) {
    alias[directory] = resolve(baseUrl, directory)
  }

  for (const [k, v] of Object.entries(paths)) {
    const custom = k.replace(/\/\*$/, '')
    const realPath = v[0].replace(/\/\*$/, '')
    alias[custom] = resolve(baseUrl, realPath)
  }
}

// console.log(resolve('.'))

// const threadLoader = require('thread-loader');
// threadLoader.warmup({
//   workers: require('os').cpus().length - 1,
//   poolTimeout: Infinity
// }, ['babel-loader']);

// eslint-disable-next-line no-underscore-dangle
const isDev = process.env.NODE_ENV !== 'production';

const entry = {
  newtab: resolve('src/pages/newtab/index.tsx'),
  popup: resolve('src/pages/popup/index.tsx'),
};

const htmlWebpackPluginList = Object.keys(entry).map((key) => new HtmlWebpackPlugin({
  inject: true,
  chunks: [key],
  filename: `${key}.html`,
  template: resolve(isDev ? 'template/dev.html' : 'template/prod.html'),
}));

module.exports = {
  entry,
  output: {
    path: resolve('build'),
    filename: '[name].[contenthash:8].bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias, // 由 tsconfig.js 转换生成，请到 tsconfig.paths 设置
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
              cacheDirectory: true,
            },
          },
          // 'eslint-loader',
        ],
      },
      {
        test: /\.(jpeg|jpg|img|gif|svg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024,
          },
        },
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),

    ...htmlWebpackPluginList,

    new CopyWebpackPlugin({
      patterns: [
        { from: resolve('config/manifest.json') },
      ],
    }),

    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: resolve('tsconfig.json'),
        profile: !isDev,
      },
    }),

    new DefinePlugin({
      __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
    }),

    new FriendlyErrorsWebpackPlugin(),

    new Webpackbar(),
  ],
};
