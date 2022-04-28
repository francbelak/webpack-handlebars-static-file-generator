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
      type: 'asset/resource',
      generator: {
        filename: 'assets/images/[name][ext]',
      },
    }, {
      test: /\.(glb|fbx|gltf)$/i,
      include: [
        path.resolve('./node_modules'),
        path.resolve('./src/assets/3D/'),
      ],
      type: 'asset/resource',
      generator: {
        filename: 'assets/3D/[name][ext]',
      },
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
      type: 'asset/resource',
      generator: {
        filename: 'assets/videos/[name][ext]',
      },
    }, {
      test: /\.php$/i,
      include: [
        path.resolve('./src/php'),
      ],
      type: 'asset/resource',
      generator: {
        filename: 'php/[name][ext]',
      },
    }, {
      test: /\.(eot|ttf|woff2?)$/i,
      include: [
        path.resolve('./node_modules'),
      ],
      type: 'asset/inline',
    }],
  },
  plugins,
};
