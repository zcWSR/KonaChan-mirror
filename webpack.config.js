const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const Config = require('./app/Config');

module.exports = {
  entry: './app/main.js',
  output: {
    path: path.resolve(__dirname, 'dev'),
    filename: 'bundle.js'
  },
  devtool: '#source-map',
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: 'css-loader'
        })
      }
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
        KONACHAN_HOST: JSON.stringify(Config.KONACHAN_HOST.production)
    }),
    new ExtractTextPlugin('style.css'),
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ]
}
