// webpack.config.js
/*
TODO:
Need to clean this up
Need HMR or something
Set up autoprefixer
Set up ENV production/dev
Generate separate CSS file via webpack?
 */
const _ = require('lodash');
const path = require('path');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const useProductionBuild = _.includes(['production', 'development'], process.env.NODE_ENV);
console.log('useProductionBuild -->', useProductionBuild);

const browserConfig = {
  entry: ['webpack-hot-middleware/client?reload=true', './src/browser/index.js'],
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]--[local]--[hash:base64:5]',
            },
          },
          { loader: 'sass-loader' },
        ],
      },
    ],
  },
  resolve: { extensions: ['.js', '.jsx'] },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      __isBrowser__: 'true',
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        WEBPACK: true,
      },
    }),
    new ExtractTextPlugin({
      filename: 'style.css',
      // allChunks: true,
    }),
  ],
};

const serverConfig = {
  entry: './src/server/index.js',
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: __dirname,
    filename: 'server.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'css-loader/locals',
            options: {
              modules: true,
              localIdentName: '[name]--[local]--[hash:base64:5]',
            },
          },
          { loader: 'sass-loader' },
        ],
      },
    ],
  },
  resolve: { extensions: ['.js', '.jsx'] },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        WEBPACK: true,
      },
      __isBrowser__: 'false',
    }),
    // new UglifyJSPlugin({
    //   sourceMap: true,
    //   uglifyOptions: {
    //     compress: {
    //       warnings: false,
    //       drop_console: false,
    //     },
    //     output: {
    //       comments: false,
    //     },
    //   },
    // }),
  ],
};

module.exports = [browserConfig, serverConfig];
