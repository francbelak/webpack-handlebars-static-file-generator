exports.config = {
  absRefPrefix: {
    dev: '', //use empty string for relative path handling
    live: '' //use empty string for relative path handling
  },
  reload: {
    protocol: 'http',
    port: '8079',
    hostname: 'localhost',
    appendScriptTag: true
  }
};
