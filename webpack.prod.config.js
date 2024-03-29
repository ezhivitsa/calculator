/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const dist = path.resolve(__dirname, 'dist');
const publicPath = process.env.PUBLIC_PATH ? `${process.env.PUBLIC_PATH}/` : '';

module.exports = {
  mode: 'production',
  entry: {
    index: './src/client/index.tsx',
  },
  output: {
    path: dist,
    filename: '[name].js',
    chunkFilename: '[name].chunk.[chunkhash].js',
    publicPath: `/${publicPath}`,
  },

  experiments: {
    asyncWebAssembly: true,
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](react|react-dom|mobx|mobx-react-lite)[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
        corejs: {
          test: /[\\/]node_modules[\\/](core-js|regenerator-runtime)[\\/]/,
          name: 'core-js',
          chunks: 'all',
        },
      },
    },
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
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                localIdentName: '[local]--[hash:base64:5]',
                localIdentContext: path.resolve(__dirname, 'src/client'),
                exportLocalsConvention: 'dashesOnly',
              },
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
    new MiniCssExtractPlugin({
      filename: 'main.[fullhash].css',
      chunkFilename: 'main.[id].[chunkhash].css',
    }),
  ],
};
