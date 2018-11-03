var query = require('json-query');

module.exports = function(config, path, fn) {
  const result = query(path, { data: config, allowRegexp: true });
  if (!result) {
    throw new Error("Could not retrieve matching nodes from webpack config. Query: " + path);
  }
  for (var i = 0, len = result.references.length; i < len; i++) {
    fn(result.references[i]);
  }
};
