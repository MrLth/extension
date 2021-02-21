/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-10-11 20:03:45
 * @LastEditTime: 2021-02-22 01:15:06
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
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
    // 'import'
  ],
  extends: [
    'airbnb',
    'airbnb/hooks',
    "plugin:@typescript-eslint/recommended",
    // 'plugin:import/errors',
    // 'plugin:import/warnings',
    // 'plugin:import/typescript'
  ],
  settings: {
    // "import/resolver": {
    //   node: {
    //     path: [
    //       resolve('src'),
    //       resolve('src/utils'),
    //     ],
    //     extensions: ['.js', '.jsx', '.tsx', '.ts', '.d.ts']
    //   },
    // },
    //   typescript: {
    //     directory: [resolve('tsconfig.json')],
    //   },
    // },
    // typescript: {},
    // 'babel-module': {
    //   extensions: ['.js', '.jsx', '.tsx', '.ts', '.d.ts'],
    //   alias: {
    //     "utils": resolve('src/utils'),
    //   }
    // },
    // "eslint-import-resolver-custom-alias": {
    //   "alias": {
    //     "src": "./src",
    //     "utils": './src/utils',
    //     "components": "./src/components"
    //   },
    //   "extensions": [".tsx", ".ts"],
    // },
    react: {
      version: "detect"
    }
  },
  rules: {
    'semi': OFF,
    "react/jsx-filename-extension": [ERROR, { extensions: [".jsx", ".tsx"] }],
    "react/no-array-index-key": WARN,
    'import/extensions': OFF,
    'no-restricted-syntax': OFF,
    "no-bitwise": OFF
  },
  overrides: [
    {
      files: [
        "*.ts",
        "*.tsx"
      ],
      parserOptions: {
        project: resolve("tsconfig.json")
      },
      rules: {
        'import/no-unresolved': OFF,
        'react/jsx-props-no-spreading': OFF
      }
    },
    {
      files: ["*.js", "*.d.ts"],
      rules: {
        '@typescript-eslint/no-var-requires': OFF
      }
    }
  ],
}