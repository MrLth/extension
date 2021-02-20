/* eslint-disable @typescript-eslint/no-var-requires */
/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-05-27 15:30:26
 * @LastEditTime: 2021-02-20 17:41:32
 * @Description: file content
 */
const { HotModuleReplacementPlugin } = require('webpack');
const { HOST, PORT, HRM_PATH } = require('./server/config')
const { merge } = require('webpack-merge');

const config = require('./webpack.common')


const entry = Object.entries(config.entry).reduce((obj, [k, v]) => {
  obj[k] = [
    `webpack-hot-middleware/client?path=http://${HOST}:${PORT}${HRM_PATH}&reload=true&overlay=true`,
    'react-hot-loader/patch',
    v
  ]
  return obj
}, {})


module.exports = merge(config, {
  mode: "development",
  entry,
  output: {
    hotUpdateChunkFilename: 'hot/[id].[hash].hot-update.js',
    hotUpdateMainFilename: 'hot/[hash].hot-update.json',
  },
  devtool: "inline-cheap-source-map",
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
                auto: /\.(local|module|m)\.s?css$/
              }
            }
          },
          'sass-loader'
        ]
      },
    ]
  },
  plugins: [
    new HotModuleReplacementPlugin()
  ]
})