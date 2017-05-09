const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: './app/main.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: ['babel-loader']
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
    new ExtractTextPlugin('style.css'),
    new webpack.DefinePlugin({
      BUILD_TIME: JSON.stringify(new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()),
      'process.env': {
            NODE_ENV: JSON.stringify('development')
        }
    })
  ],
  resolve: {
    alias: {
      'Utils/Http': '/app/Utils/Http' 
    }
  }
}
