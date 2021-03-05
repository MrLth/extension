/* eslint-disable @typescript-eslint/no-var-requires */
/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-05-27 15:30:26
 * @LastEditTime: 2021-03-05 11:54:28
 * @Description: file content
 */
const { HotModuleReplacementPlugin } = require('webpack');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { merge } = require('webpack-merge');
const { HOST, PORT, HRM_PATH } = require('../server/config')

const config = require('./webpack.common')

const entry = Object.entries(config.entry).reduce((obj, [k, v]) => ({
  ...obj,
  [k]: [
    `webpack-hot-middleware/client?path=http://${HOST}:${PORT}${HRM_PATH}&reload=true&overlay=true`,
    v,
  ],
}), {})

module.exports = merge(config, {
  mode: 'development',
  entry,
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  output: {
    hotUpdateChunkFilename: 'hot/[id].[hash].hot-update.js',
    hotUpdateMainFilename: 'hot/[hash].hot-update.json',
  },
  devtool: 'inline-cheap-source-map',
  cache: { type: 'filesystem' },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: /\.(local|module|m)\.s?css$/,
                localIdentName: '[folder]_[hash:base64:5]__[local]',
              },
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new HotModuleReplacementPlugin(),

    new ReactRefreshPlugin({
      overlay: {
        sockIntegration: 'whm',
      },
    }),
  ],
})
