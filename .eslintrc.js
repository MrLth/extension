/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-10-11 20:03:45
 * @LastEditTime: 2021-02-24 11:50:37
 * @Description: file content
 */
const { resolve } = require('path');

const OFF = 0;
const WARN = 1
const ERROR = 2;

module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    webextensions: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'import',
  ],
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
  ],
  settings: {
    'import/resolver': {
      // fix import alias not working
      typescript: {
        project: [resolve('tsconfig.json')],
      },
    },

    react: {
      version: 'detect',
    },
  },
  globals: {
    $log: 'readonly',
    $debug: 'readonly',
    __DEV__: 'readonly'
  },
  rules: {
    semi: OFF,
    'no-undef': ERROR,
    'react/jsx-filename-extension': [ERROR, { extensions: ['.jsx', '.tsx'] }],
    'react/no-array-index-key': WARN,
    'no-restricted-syntax': OFF,
    'no-bitwise': OFF,
    'no-console': OFF,
    'import/extensions': [
      ERROR,
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
  },
  overrides: [
    {
      files: [
        '*.ts',
        '*.tsx',
      ],
      parserOptions: {
        project: resolve('tsconfig.json'),
      },
      rules: {
        'react/jsx-props-no-spreading': OFF, // spreading props in typescript is safely
      },
    },
    {
      files: ['*.js', '*.d.ts'],
      rules: {
        '@typescript-eslint/no-var-requires': OFF,
      },
    },
  ],
}
