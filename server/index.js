/* eslint-disable import/no-extraneous-dependencies */
/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-20 08:54:59
 * @LastEditTime: 2021-02-21 02:46:53
 * @Description: file content
 */

const webpack = require('webpack')
const express = require('express')
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const devConfig = require('../config/webpack.dev');
const { HOST, PORT, HRM_PATH } = require('./config');

const app = express();
const compiler = webpack(devConfig);
const publicPath = devConfig.output?.publicPath;

app
  .use(webpackDevMiddleware(compiler, {
    publicPath,
    stats: 'minimal',
    writeToDisk: true,
  }))
  .use(webpackHotMiddleware(compiler, {
    path: HRM_PATH,
  }))
  .listen(PORT, HOST, (err) => {
    if (err) console.error(err)
    else console.log(`server is running at http://${HOST}:${PORT}`);
  });
