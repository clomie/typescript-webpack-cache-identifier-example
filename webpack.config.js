const fs = require('fs')
const hash = require('hash-sum')

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const cacheIdentifier = hash([
  require('typescript/package.json').version,
  require('ts-loader/package.json').version,
  require('cache-loader/package.json').version,
  require('./tsconfig.json'),
  fs.readFileSync('./webpack.config.js', 'utf-8'),
  process.env.NODE_ENV
])

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  entry: ['./src/index.ts'],
  output: {
    path: __dirname + '/dist',
    filename: 'app.js'
  },
  resolve: {
    extensions: ['.js', '.json', '.ts']
  },
  module: {
    rules: [
      {
        test: /\.[jt]s$/,
        use: [
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: __dirname + '/node_modules/.cache/ts-loader',
              cacheIdentifier
            }
          },
          { loader: 'thread-loader' },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              happyPackMode: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      tslint: false,
      formatter: 'codeframe',
      checkSyntacticErrors: true
    })
  ]
}
