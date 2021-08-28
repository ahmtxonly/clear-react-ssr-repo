/* eslint-disable global-require */
const path = require('path');
const pkg = require('../package.json');

const isDebug = !process.argv.includes('--release');

// CSS Nano options http://cssnano.co/
const minimizeCssOptions = {
  discardComments: { removeAll: true },
};

module.exports = () => ({
  // The list of plugins for PostCSS
  // https://github.com/postcss/postcss
  plugins: [
    // Adds the ability to use a custom property in the options, at-rules.
    // https://github.com/Scrum/postcss-at-rules-variables
    require('postcss-at-rules-variables')(),
    // Transfer @import rule by inlining content, e.g. @import 'normalize.css'
    // https://github.com/postcss/postcss-import
    require('postcss-import')(),
    // Font Magician is a PostCSS plugin that magically generates all of your @font-face rules.
    // Never write a @font-face rule again.
    // https://github.com/jonathantneal/postcss-font-magician
    require('postcss-font-magician')({
      display: 'swap',
      variants: {
        Inter: {
          300: [],
          400: [],
          700: [],
        },
      },
      foundries: ['google'],
      protocol: 'https:',
    }),
    // PostCSS plugin to write reusable mixins
    // https://github.com/postcss/postcss-mixins
    require('postcss-mixins')({
      mixinsDir: path.resolve(__dirname, '../src/styles/mixins'),
    }),
    // PostCSS plugin to unwrap nested rules like how Sass does it.
    // https://github.com/postcss/postcss-nested
    require('postcss-nested')(),
    // W3C calc() function, e.g. div { height: calc(100px - 2em); }
    // https://github.com/postcss/postcss-calc
    require('postcss-calc')(),
    // Convert CSS shorthand filters to SVG equivalent, e.g. .blur { filter: blur(4px); }
    // https://github.com/iamvdo/pleeease-filters
    require('pleeease-filters')(),
    // Generate pixel fallback for "rem" units, e.g. div { margin: 2.5rem 2px 3em 100%; }
    // https://github.com/robwierzbowski/node-pixrem
    require('pixrem')(),
    // Postcss lostgrid
    // https://github.com/peterramsing/lost
    require('lost')(),
    // Postcss flexbox bug fixer
    // https://github.com/luisrudge/postcss-flexbugs-fixes
    require('postcss-flexbugs-fixes')(),
    // PostCSS Preset Env, which allows you easily to use all the features in cssdb.
    // See what features in which stage in https://preset-env.cssdb.org/features
    // https://github.com/csstools/postcss-preset-env
    require('postcss-preset-env')({
      stage: 3,
      browsers: pkg.browserslist,
      features: {
        // lets you modify colors using the color-mod() function in CSS
        'color-mod-function': {
          importFrom: path.resolve(__dirname, '../src/styles/variables.css'),
          unresolved: 'ignore', // ignore unresolved color-mod() functions
        },
      },
      autoprefixer: { flexbox: 'no-2009' },
    }),
    // CSS Nano http://cssnano.co/
    ...(isDebug
      ? []
      : [
          require('cssnano')({
            preset: ['default', minimizeCssOptions],
          }),
        ]),
  ],
});
