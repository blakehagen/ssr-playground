// webpack.config.js
/*
TODO:
Need to clean this up
Need HMR or something
Set up autoprefixer
Set up ENV production/dev
Generate separate CSS file via webpack?
 */

var path          = require('path')
var webpack       = require('webpack')
var nodeExternals = require('webpack-node-externals')

const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

var browserConfig = {
  entry: './src/browser/index.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options:
              {
                modules: true,
                localIdentName: '[name]--[local]--[hash:base64:5]'
              }
          },
          { loader: 'sass-loader' }
        ],
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __isBrowser__: "true"
    }),
    new ExtractTextPlugin({
      filename: 'style.css',
      // allChunks: true
    })
  ]
}

var serverConfig = {
  entry: './src/server/index.js',
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: __dirname,
    filename: 'server.js',
    publicPath: '/'
  },
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader' },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'css-loader/locals',
            options:
              {
                modules: true,
                localIdentName: '[name]--[local]--[hash:base64:5]'
              }
          },
          { loader: 'sass-loader' }
        ],
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __isBrowser__: "false"
    })
  ]
}

module.exports = [browserConfig, serverConfig]