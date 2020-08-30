const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const PACKAGE = require('./package.json');

module.exports = {
  entry: [
    './src/App.jsx',
    './src/App.scss',
  ],
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
            presets:["@babel/preset-env", "@babel/preset-react"]
        }
      },
      {
        test: /\.scss$/,
        use: [
            'style-loader',
            {loader: 'css-loader', options: { modules: true }},
            'sass-loader'
        ]
      }
    ]
  },
  plugins:[
    new webpack.DefinePlugin({
      __APP_NAME__: JSON.stringify(PACKAGE.name),
      __APP_VERSION__: JSON.stringify(PACKAGE.version),
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    hot: true,
    historyApiFallback: {
      index: '/'
    },
  }
};
