const webpack = require('webpack');
const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?/,
        include: path.resolve(__dirname, 'src', 'client'),
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015'],
          plugins: ["transform-es2015-destructuring", "transform-object-rest-spread"]
        }
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
              sourceMap: true,
              importLoaders: 1,
              localIdentName: "[name]--[local]--[hash:base64:8]"
            }
          }
        ]
      }
    ]
  },
  entry: path.resolve(__dirname, 'src', 'client', 'index.jsx'),
  output: {
    path: path.resolve(__dirname, 'src', 'dist'),
    filename: 'bundle.js'
  },
  watch: true
};
