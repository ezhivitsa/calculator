const postcssImport = require('postcss-import');
const postcssPresetEnv = require('postcss-preset-env');

const cssnano = require('cssnano');

module.exports = () => ({
  plugins: [
    postcssImport({
      path: ['src/client/styles']
    }),
    postcssPresetEnv({
      stage: 2,
      feature: {
        'nesting-rules': true,
        'custom-media-queries': true
      }
    }),
    cssnano()
  ]
});
