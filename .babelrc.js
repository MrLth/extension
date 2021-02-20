/* eslint-disable @typescript-eslint/no-var-requires */
/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-20 14:18:21
 * @LastEditTime: 2021-02-20 17:37:32
 * @Description: file content
 */
module.exports = (api) => {
  api.cache(true)

  const { minimum_chrome_version } = require(`./manifest.json`);

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
      '@babel/plugin-transform-runtime',
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-proposal-optional-chaining',
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }]
    ],
    env: {
      development: {
        presets: [['@babel/preset-react', { development: true }]],
        plugins: ['react-hot-loader/babel'],
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