const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: {
    index: './app/main.js',
    vendor: ['react', 'react-dom', 'rxjs/Rx']
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
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
      output: {
        comments: false, // remove all comments
      },
      compress: {
        warnings: false 
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor'], //manifest：不再重复打包vendor.js影响速度
        minChunks: Infinity,
        filename: 'vendor.js' 
    }),
    new ExtractTextPlugin('style.css')
  ],
  // externals: 从外部引用，不放到打包内容中
  // externals: {
  //   'react': 'React',
  //   'react-dom': 'ReactDOM'
  // } 

}
