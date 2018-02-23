const DEBUG = process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'live';

module.exports = ({ file, options, env }) => ({
  parser: file.extname === '.css' ? 'sugarss' : require('postcss-scss'),
  plugins: {
    'postcss-import': {},
    'postcss-cssnext': {
      warnForDuplicates: false
    },
    'cssnano': {},
    'postcss-object-fit-images': {}
  },
  sourceMap: DEBUG
});
