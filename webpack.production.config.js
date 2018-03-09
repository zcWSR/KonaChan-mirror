const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const Config = require('./app/Config');

module.exports = {
  entry: {
    index: './app/main.js',
    vendor: ['react', 'react-dom', 'rxjs/Rx']
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.[hash].js',
    //chunkFilename: "vendor.[chunkHash:8].js",
  },
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
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
      warnings: false
    }),
    new webpack.DefinePlugin({
        KONACHAN_HOST: JSON.stringify(Config.KONACHAN_HOST.develop)
    }),
    new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor'], //manifest：不再重复打包vendor.js影响速度
        minChunks: Infinity,
        filename: '[name].[hash].js' 
    }),
    new ExtractTextPlugin('style.[hash].css'),
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ],
  // externals: 从外部引用，不放到打包内容中
  // externals: {
  //   'react': 'React',
  //   'react-dom': 'ReactDOM'
  // } 

}
