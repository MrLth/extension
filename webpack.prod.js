/* eslint-disable @typescript-eslint/no-var-requires */
/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-05-27 15:30:26
 * @LastEditTime: 2021-02-20 17:44:08
 * @Description: file content
 */
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin'); // 比直接使用 TerserPlugin 更快
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { minimum_chrome_version } = require(`./manifest.json`);
const { merge } = require('webpack-merge');
const config = require('./webpack.common')

// 解析命令行参数, 但是配合 webpack-cli 会报错
// const argv = require('minimist')(process.argv.slice(2))
// require("speed-measure-webpack-plugin");
// require("terser-webpack-plugin")

module.exports = merge(config, {
  mode: "production",
  optimization: {
    minimize: false,
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 4, // 被多次引入的包会优先分出来，不受 maxInitialRequests 限制
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
            return `npm.${packageName.replace('@', '')}` // npm 软件包名称是 URL 安全的，但是某些服务器不喜欢@符号
          },
        },
      }
    },
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: /\.(local|module|m)\.s?css$/
              }
            }
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "postcss-preset-env",
                    {
                      browsers: minimum_chrome_version
                        ? `Chrome > ${minimum_chrome_version}`
                        : 'last 2 Chrome versions'
                    },
                  ],
                ],
              },
            },
          },
          'sass-loader'
        ]
      }
    ]
  },

  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: './public/asset/react-dom.production.min.js' },
        { from: './public/asset/react.production.min.js' }
      ]
    }),

    new MiniCssExtractPlugin(),

    new CssMinimizerPlugin(),

    new ParallelUglifyPlugin({
      exclude: /min.js$/,
      terser: true,
    }),

    new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
  ],
  externals: {
    react: "React",
    "react-dom": "ReactDOM"
  }
})