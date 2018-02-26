let webpack = require('webpack');
let webPackSettings = require('./webpack.settings.js');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const merge = require('lodash.merge');
const LIVE = process.env.NODE_ENV === 'live';
const PRODUCTION = process.env.NODE_ENV === 'production';
const defaultLanguage = webPackSettings.config.defaultLanguage;
let absRefPrefix = webPackSettings.config.absRefPrefix.dev;
let DEBUG = true;

if (PRODUCTION || LIVE) {
  DEBUG = false;
}

let languages = fs.readdirSync(path.join(__dirname, 'data'));
languages.splice(languages.indexOf('_global.json'), 1);
languages.splice(languages.indexOf('_override.json'), 1);
const globalData = require(path.join(__dirname, 'data/_global.json'));
const overridesData = require(path.join(__dirname,'data/_override.json'));

if (!languages || languages.length === 0) {
  console.error('Specifiy a language data json in ', path.join(__dirname, 'data'));
  process.exit(1);
}

if (defaultLanguage && languages.indexOf(defaultLanguage + '.json') === -1) {
  console.error(`Create a language data json for your default language "${defaultLanguage}" in ${path.join(__dirname, 'data')}`);
  process.exit(1);
}

if (LIVE) {
  absRefPrefix = webPackSettings.config.absRefPrefix.live;
}

const defaultRouteFolder = '/routes/default';

function isDefaultRoute(path) {
  let isDefault = false;
  if (path.indexOf(defaultRouteFolder) > -1) {
    isDefault = true;
  }
  return isDefault;
}

const CleanWebpackPlugin = require('clean-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HandlebarsPlugin = require('handlebars-webpack-plugin');
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
  new LiveReloadPlugin(webPackSettings.config.reload)
];
pluginArrayDebug = pluginArrayDebug.concat(pluginArrayGeneric);

let pluginArrayLive = [
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false })
];
pluginArrayLive = pluginArrayLive.concat(pluginArrayGeneric);

let handlebarsPlugins = [];
languages.forEach((languagefile) => {
  const language = languagefile.substr(0, languagefile.indexOf('.json'));
  const languageData = path.join(__dirname, `data/${language}.json`);
  let data = require(languageData);
  globalData.absRefPrefix = (absRefPrefix === '') ? '../../' : absRefPrefix;
  data = merge({}, globalData, data, overridesData);

  handlebarsPlugins.push(
    new HandlebarsPlugin({
      entry: path.join(process.cwd(), 'src', 'templates', '*', '*', 'index.handlebars'),
      data: data,
      onBeforeRender: function (Handlebars, data, filename) {
        if (language === defaultLanguage && isDefaultRoute(filename)) {
          data = Object.assign(data, { absRefPrefix: './' });
        } else if (isDefaultRoute(filename)) {
          data = Object.assign(data, { absRefPrefix: '../' });
        } else if (data.absRefPrefix === '../' || data.absRefPrefix === './') {
          data = Object.assign(data, { absRefPrefix: '../../' });
          if (language === defaultLanguage)
            data = Object.assign(data, { absRefPrefix: '../' });
        }
        return data;
      },
      onBeforeSave: function (Handlebars, resultHtml, filename) {
        let languagePath = language;
        if (language === defaultLanguage) {
          languagePath = '';
        }

        const routesFolder = '/routes';
        let targetFilepath = path.join(__dirname, 'dist', languagePath, filename.substr(filename.indexOf(routesFolder) + routesFolder.length)) + '.html';

        if (isDefaultRoute(filename)) {
          targetFilepath = path.join(__dirname, 'dist', languagePath, filename.substr(filename.indexOf(defaultRouteFolder) + defaultRouteFolder.length)) + '.html';
        }

        return {
          resultHtml: resultHtml,
          targetFilepath: targetFilepath
        };
      },
      partials: [
        path.join(process.cwd(), 'src', 'templates', '*', '*.handlebars')
      ]
    })
  );
});

pluginArrayLive = pluginArrayLive.concat(handlebarsPlugins);
pluginArrayDebug = pluginArrayDebug.concat(handlebarsPlugins);

module.exports = {
  entry: {
    '/dist/js/main.dist': './src/js/main.js',
    '/dist/assets/images/svg-sprite': glob.sync(path.resolve(__dirname, 'src/assets/images/svg/**/*.svg')),
    '/dist/assets/images/': glob.sync(path.resolve(__dirname, 'src/assets/images/**/*.*')),
    '/dist/css/main': './src/sass/main.scss',
    '/dist/css/critical': './src/sass/critical.scss'
  },
  output: {
    path : path.resolve(__dirname),
    filename: '[name].js'
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
      loader: 'svg-sprite-loader',
      include: path.resolve('./src/assets/images/svg'),
      options: {
        extract: true,
        spriteFilename: './dist/assets/images/svg-sprite.svg'
      }
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
      test: /\.(jpe?g|png|gif|svg)$/i,
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
      },{
        loader: 'cleanup-loader',
        options: {
          test: /\.(jpe?g|png|gif|svg|eot|ttf|woff2?)$/i
        }
      }]
    }]
  },
  plugins: DEBUG ? pluginArrayDebug :  pluginArrayLive
};
