const path = require('path');

/* eslint-disable */
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webPackSettings = require('./webpack.settings.js');
/* eslint-enable */

const plugins = [
  new SpriteLoaderPlugin({ plainSprite: true }),
  new ESLintPlugin(),
  new MiniCssExtractPlugin({
    // [name] contains full path - remove path and use only filename with correct dist path
    filename: ({ chunk: { name } }) => `css/${name.substr(name.lastIndexOf('/'))}.css`,
  }),
];

module.exports = {
  mode: 'development',
  entry: {
    'js/main.dist': './src/js/main.js',
  },
  output: {
    path: path.resolve(__dirname),
    filename: '[name].js',
  },
  devtool: 'source-map',
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: '/node_modules/',
    }, {
      test: /\.scss$/,
      include: [
        path.resolve('./src/sass/critical.scss'),
        path.resolve('./src/sass/main.scss'),
      ],
      use: [{
        loader: MiniCssExtractPlugin.loader,
        options: {
          publicPath: './',
        },
      }, {
        loader: 'css-loader',
        options: {
          sourceMap: true,
        },
      }, {
        loader: 'postcss-loader',
        options: {
          sourceMap: true,
        },
      }, {
        loader: 'sass-loader',
        options: {
          sourceMap: true,
        },
      }],
    }, {
      test: /\.svg$/i,
      include: path.resolve('./src/assets/images/svg'),
      use: [{
        loader: 'svg-sprite-loader',
        options: {},
      }, {
        loader: 'svgo-loader',
        options: {
          plugins: [{
            name: 'removeAttrs',
            params: { attrs: '(fill|stroke|fill-opacity)' },
          }],
        },
      }],
    }, {
      test: /\.(jpe?g|png|gif|svg|ico)$/i,
      exclude: path.resolve('./src/assets/images/svg'),
      include: [
        path.resolve('./node_modules'),
        path.resolve('./src/assets/images/'),
      ],
      use: [{
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          publicPath: '../assets/images/',
          outputPath: './assets/images/',
        },
      }],
    }, {
      test: /\.handlebars$/,
      use: [{
        loader: 'webpack-handlebars-loader',
        options: {
          // Note: use partials without trailing slash
          partials: path.resolve(__dirname, 'src/templates/partials/**/*.handlebars'),
          relativePathTo: path.resolve(__dirname, 'src/templates/routes'),
          outputpath: '.',
          data: path.resolve(__dirname, 'data/**/*.json'),
          rootData: webPackSettings.config.defaultLanguage,
        },
      }],
    }, {
      test: /\.mp4/i,
      include: [
        path.resolve('./src/assets/videos/'),
      ],
      use: [{
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          publicPath: '../assets/videos/',
          outputPath: './assets/videos/',
        },
      }],
    }, {
      test: /\.php$/i,
      loader: 'file-loader',
      include: [
        path.resolve('./src/php'),
      ],
      options: {
        name: '[name].[ext]',
        outputPath: './php/',
      },
    }, {
      test: /\.(eot|ttf|woff2?)$/i,
      loader: 'file-loader',
      include: [
        path.resolve('./node_modules'),
      ],
      options: {
        name: '[name].[ext]',
        publicPath: './fonts/',
        outputPath: './css/fonts/',
      },
    }],
  },
  plugins,
};
