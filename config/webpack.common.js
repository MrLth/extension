/* eslint-disable @typescript-eslint/no-var-requires */
/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-05-27 15:30:26
 * @LastEditTime: 2021-02-21 02:36:52
 * @Description: file content
 */
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const Webpackbar = require('webpackbar');
// const threadLoader = require('thread-loader');
// threadLoader.warmup({
//   workers: require('os').cpus().length - 1,
//   poolTimeout: Infinity
// }, ['babel-loader']);

// eslint-disable-next-line no-underscore-dangle
const __DEV__ = process.env.NODE_ENV !== 'production';

const entry = {
  newtab: resolve('src/pages/newtab/index.tsx'),
  popup: resolve('src/pages/popup/index.tsx'),
};

const htmlWebpackPluginList = Object.keys(entry).map((key) => new HtmlWebpackPlugin({
  inject: true,
  chunks: [key],
  filename: `${key}.html`,
  template: resolve(__DEV__ ? 'template/dev.html' : 'template/prod.html'),
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
    alias: {
      '@img': resolve('public/img'),
      public: resolve('public'),
      components: resolve('src/components'),
      utils: resolve('src/utils'),
      config: resolve('config'),
      models: resolve('src/models'),
      src: resolve('src'),
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
              cacheDirectory: true,
            },
          },
          'eslint-loader',
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
        profile: !__DEV__,
      },
    }),

    new FriendlyErrorsWebpackPlugin(),

    new Webpackbar(),
  ],
};
