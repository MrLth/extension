/* eslint-disable @typescript-eslint/no-var-requires */
/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-20 14:18:21
 * @LastEditTime: 2021-03-07 23:28:36
 * @Description: file content
 */
const { resolve } = require('path')
const { minimum_chrome_version } = require(resolve('config/manifest.json'));

module.exports = (api) => {
  api.cache(true)

  return {
    presets: [
      '@babel/preset-typescript',
      [
        '@babel/env',
        {
          modules: false,
          targets: minimum_chrome_version
            ? `Chrome > ${minimum_chrome_version}`
            : 'last 2 Chrome versions',
          useBuiltIns: 'usage',
          corejs: 3,
        },
      ]
    ],
    plugins: [
      ['./public/plugin-log/plugin.js', { remove: false }],
      "const-enum",
      '@babel/plugin-transform-runtime',
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-proposal-optional-chaining',
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }]
    ],
    env: {
      development: {
        presets: [['@babel/preset-react', { development: true }]],
        // plugins: ['react-hot-loader/babel'],
        plugins: [
          'react-refresh/babel'
        ],
      },
      production: {
        presets: ['@babel/preset-react'],
        plugins: [
          'babel-plugin-dev-expression',
          '@babel/plugin-transform-react-constant-elements',
          '@babel/plugin-transform-react-inline-elements',
        ],
      },
    },
  };
};
