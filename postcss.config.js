/* eslint-disable */
module.exports = ({ file }) => ({
  parser: file.extname === '.css' ? 'sugarss' : require('postcss-scss'),
  plugins: {
    'postcss-import': {},
    'postcss-preset-env': {},
    cssnano: {},
  },
  sourceMap: false,
});
