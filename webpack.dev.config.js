/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const dist = path.resolve(__dirname, 'dist');

module.exports = {
  mode: 'development',

  // Enable sourcemaps for debugging webpack's output.
  devtool: 'source-map',

  entry: './src/client/index.tsx',
  output: {
    path: dist,
    filename: '[name].js',
  },
  devServer: {
    contentBase: dist,
    hot: true,
  },

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },

  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },

      // css-loader to bundle all the css files into one file and style-loader
      // to add all the styles inside the style tag of the document
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/client/index.html',
    }),
  ],
};
