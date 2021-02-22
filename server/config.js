/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-20 11:12:44
 * @LastEditTime: 2021-02-22 15:51:34
 * @Description: file content
 */
const { resolve } = require('path')

module.exports = {
  HOST: '127.0.0.1',
  PORT: 3456,
  HRM_PATH: '/__webpack_HMR__',
  PROJECT_ROOT: resolve(__dirname, '../'),
  resolve: resolve.bind(null, __dirname, '../'),
};
