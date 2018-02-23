const loaderUtils = require('loader-utils');

module.exports = function(source) {
    this.cacheable();
    const {test} = loaderUtils.getOptions(this);
    this._compiler.plugin('emit', cleanupUnwantedJsFiles(test));
    this.callback(null, source);
};

function cleanupUnwantedJsFiles(test) {
    return (compilation, callback) => {
        for (let key in compilation.options.entry) {
            let entry = compilation.options.entry[key];
            if (typeof entry !== 'string' && entry.pop) {
                entry = entry.pop();
            }
            if (typeof entry === 'string' && test.test(entry)) {
                delete compilation.assets[key + '.js'];
                delete compilation.assets[key + '.js.map'];
            }
        }
        callback();
    }
}
