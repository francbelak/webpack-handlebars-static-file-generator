let webPackSettings = require('./webpack.settings.js');
const path = require('path');
const fs = require('fs');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const plugins = [
  new CleanWebpackPlugin([
    './dist'
  ], {
    root: __dirname,
    verbose:  true,     //WRITE CONSOLE LOGS
    dry:      false     //TEST EMULATE DELETE - ONLY CONSOLE LOGS WHAT SHOULD BE DELETED
  }),
  new SpriteLoaderPlugin({ plainSprite: true })
];

const deploySettingsFilepath = './deploy.settings.js';
if (fs.existsSync(deploySettingsFilepath)) {
  plugins.push(new CopyWebpackPlugin([{
    from: deploySettingsFilepath,
    to: './dist'
  }]));
}

module.exports = {
  mode: 'production',
  entry: {
    '/dist/js/main.dist': './src/js/main.js'
  },
  output: {
    path : path.resolve(__dirname),
    filename: '[name].js'
  },
  module : {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: '/node_modules/'
    },{
      test: /\.scss$/,
      include: [
        path.resolve('./src/sass/critical.scss'),
        path.resolve('./src/sass/main.scss')
      ],
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader'
      }, {
        loader: 'sass-loader'
      }]
    }, {
      test: /\.svg$/i,
      include: path.resolve('./src/assets/images/svg'),
      use:[{
        loader: 'svg-sprite-loader',
        options: {}
      }, {
        loader: 'svgo-loader',
        options: {
          plugins: [{
            removeAttrs: { attrs: '(fill|stroke|fill-opacity)' }
          }]
        }
      }]
    }, {
      test: /\.(eot|ttf|woff2?)$/i,
      loader: 'file-loader',
      include: [
        path.resolve('./node_modules'),
      ],
      options: {
        name: '[name].[ext]',
        publicPath: './fonts/',
        outputPath: 'dist/css/fonts/',
      }
    }, {
      test: /\.(jpe?g|png|gif|svg|ico)$/i,
      exclude: path.resolve('./src/assets/images/svg'),
      include: [
        path.resolve('./node_modules'),
        path.resolve('./src/assets/images/')
      ],
      use: [{
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          publicPath: '../assets/images/',
          outputPath: 'dist/assets/images/'
        }
      }, {
        loader: 'image-webpack-loader',
        options: {
          mozjpeg: {
            progressive: true,
            quality: [0.65]
          },
          optipng: {
            enabled: true
          },
          pngquant: {
            quality: [0.65,0.90],
            speed: 4
          },
          gifsicle: {
            interlaced: true
          }
        }
      }, {
        loader: 'cleanup-loader',
        options: {
          test: /\.(jpe?g|png|gif|svg|eot|ttf|woff2?)$/i
        }
      }]
    }, {
      test: /\.handlebars$/,
      use: [{
        loader: 'webpack-handlebars-loader',
        options: {
          //Note: use partials without trailing slash
          partials: path.resolve(__dirname, 'src/templates/partials/**/*.handlebars'),
          relativePathTo: path.resolve(__dirname, 'src/templates/routes'),
          outputpath: 'dist',
          data: path.resolve(__dirname,'data/**/*.json'),
          rootData: webPackSettings.config.defaultLanguage
        }
      }]
    }, {
      test: /\.mp4/i,
      include: [
        path.resolve('./src/assets/videos/')
      ],
      use: [{
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          publicPath: '../assets/videos/',
          outputPath: 'dist/assets/videos/'
        }
      }]
    }, {
      test: /\.php$/i,
      loader: 'file-loader',
      include: [
        path.resolve('./src/php'),
      ],
      options: {
        name: '[name].[ext]',
        outputPath: 'dist/php/',
      }
    }]
  },
  plugins: plugins
};
