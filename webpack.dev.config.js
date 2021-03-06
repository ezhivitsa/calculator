/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin');

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
    modules: ['node_modules', path.resolve(__dirname, 'src/client'), __dirname],
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
        test: /\.pcss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                mode: 'local',
                localIdentName: '[local]--[hash:base64:5]',
                context: path.resolve(__dirname, 'src/client'),
              },
              localsConvention: 'dashesOnly',
            },
          },
          'postcss-loader',
        ],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/client/index.html',
    }),
    new WasmPackPlugin({
      crateDirectory: __dirname,
      outName: 'calculator',
      outDir: 'pkg',
    }),
  ],
};
