```diff
! ATTENTION:
! By this point, you should be using Razzle 3, which
! removes the need for these custom Razzle configuration
! workarounds.
```

# razzle-config-transform
## Helper utility for deeply nested webpack configurations

[Razzle](https://github.com/jaredpalmer/razzle) is awesome. And if you've used razzle at all, you've also discovered a need to create a `razzle.config.js` file in order to tune your webpack "just right" without having to eject.

`razzle-config-transform` is what you should reach for when you have more complex webpack transformations, but aren't ready to write your own transformation functions.

It works using the excellent [json-query](https://www.npmjs.com/package/json-query) library.

# Example
This example adds the [inline-react-svg](https://github.com/airbnb/babel-plugin-inline-react-svg) module to your babel config. Since it is a babel plugin, we query for the `babel-loader` instance, and then operate on any found references of the babel loader.

```js
var transform = require('@aibex/razzle-config-transform');
module.exports = {
  modify: (config, { target, dev }, webpack) => {
    transform(config, 'module.rules.use[loader~/babel-loader/]', (ref) => {
      ref.options.plugins.push(['inline-react-svg', {
        svgo: {
          plugins: [
            { removeAttrs: { attrs: '(data-name)' }},
            { cleanupIDs: true }
          ]
        }
      }]);
    });

    return config;
  });
};
```

# API
## `transform(config, path, onEachReference)`
**config** A webpack configuration object, provided from razzle

**path** A `json-query` friendly path. [See the full json-query docs](https://www.npmjs.com/package/json-query) for additional options. All queries run with the regex option enabled, as we must often look for fully-resolved loaders in the razzle version of a webpack config.

The most common path used in razzle is `module.rules.use[loader~/YOUR-LOADER/]`, performing a regex match on all loader nodes, finding the one that matches your regex pattern, and then returning the entire `use: {}` collection as a reference. If multiple instances of a path are found, **onEachReference** is called once per match.

**onEachReference** `function(ref) {...}` A function called for every matching reference. In order to avoid complex merge issues, you simply alter the reference directly. `razzle-config-transform` does not attempt to re-merge final objects, that is the responsibility of the developer.

# About
This was actually created so that razzle 2 could support babel 7, by extracting the [babel 7 part](https://github.com/jaredpalmer/razzle/blob/e89853267639d62d7930f6ad0e283a5049ccbd35/packages/babel-preset-razzle/index.js) of `razzle@next` and making it something that could be applied in `razzle.config.js`.
