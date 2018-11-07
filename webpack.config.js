let webpack = require('webpack');
let webPackSettings = require('./webpack.settings.js');
const path = require('path');
const glob = require('glob');
const fs = require('fs');
const LIVE = process.env.NODE_ENV === 'live';
let DEBUG = true;

if (LIVE) {
  DEBUG = false;
}

const CleanWebpackPlugin = require('clean-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WatchExternalFilesPlugin = require('webpack-watch-files-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const extractSass = new ExtractTextPlugin({
  filename: '[name].css',
  disable: false //Remove debug option in case of source map issues
});

const pluginArrayGeneric = [
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery'
  }),
  new CleanWebpackPlugin([
    './dist'
  ], {
    root: __dirname,
    verbose:  true,     //WRITE CONSOLE LOGS
    dry:      false     //TEST EMULATE DELETE - ONLY CONSOLE LOGS WHAT SHOULD BE DELETED
  }),
  extractSass,
  new SpriteLoaderPlugin({ plainSprite: true })
];

let pluginArrayDebug = [
  new WatchExternalFilesPlugin.default({
    files: [
      path.resolve(__dirname, 'src/templates/partials/**/*.handlebars'),
      path.resolve(__dirname,'data/**/*.json')
    ]
  }),
  new LiveReloadPlugin(webPackSettings.config.reload)
];
pluginArrayDebug = pluginArrayDebug.concat(pluginArrayGeneric);

let pluginArrayLive = [
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false })
];

const deploySettingsFilepath = './deploy.settings.js';
if (fs.existsSync(deploySettingsFilepath)) {
  pluginArrayLive.push(new CopyWebpackPlugin([{
    from: './deploy.settings.js',
    to: './dist'
  }]));
}

pluginArrayLive = pluginArrayLive.concat(pluginArrayGeneric);

module.exports = {
  entry: {
    '/dist/js/main.dist': './src/js/main.js',
    '/dist/assets/images/': glob.sync(path.resolve(__dirname, 'src/assets/images/**/*.*')),
    '/dist/css/main': './src/sass/main.scss',
    '/dist/handlebars': glob.sync(path.resolve(__dirname, 'src/templates/routes/**/index.handlebars'))
  },
  output: {
    path : path.resolve(__dirname),
    filename: '[name].js'
  },
  watchOptions: {
    poll: true
  },
  devtool: (DEBUG) ? 'source-map' : 'none',
  module : {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: '/node_modules/',
      options: {
        presets: [
          'es2015',
          'stage-2'
        ],
        plugins: ['transform-object-assign']
      }
    },{
      test: /\.scss$/,
      include: path.resolve('./src/sass/critical.scss'),
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader'
      }, {
        loader: 'sass-loader'
      }]
    }, {
      test: /\.scss$/,
      exclude: path.resolve('./src/sass/critical.scss'),
      use: extractSass.extract({
        use: [{
          loader: 'css-loader',
          options: {
            sourceMap: DEBUG,
            importLoaders: 2
          }
        }, {
          loader: 'postcss-loader',
          options: {
            sourceMap: DEBUG
          }
        }, {
          loader: 'resolve-url-loader'
        }, {
          loader: 'sass-loader',
          options: {
            sourceMap: true //must be enabled for resolve-ur-loader to work see: https://github.com/bholloway/resolve-url-loader#important
          }
        },{
          loader: 'cleanup-loader',
          options: {
            test: /\.s?css$/i
          }
        }],
        // use style-loader in development
        fallback: {
          loader: 'style-loader',
          options: {
            sourceMap: DEBUG
          }
        }
      })
    }, {
      test: /\.svg$/i,
      include: path.resolve('./src/assets/images/svg'),
      use:[{
        loader: 'svg-sprite-loader'
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
            quality: 65
          },
          optipng: {
            enabled: true
          },
          pngquant: {
            quality: '65-90',
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
  plugins: DEBUG ? pluginArrayDebug :  pluginArrayLive
};
