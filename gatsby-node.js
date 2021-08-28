const path = require('path');
const webpack = require('webpack');

// while config folder is at the root of the project, docz tries to resolve it from .docz folder, so this path is relative to .docz folder
process.env.NODE_CONFIG_DIR = path.join(__dirname, '../config');
const nodeConfig = require('config');

const CSS_PATTERN = /\.css$/;
const MODULE_CSS_PATTERN = /\.module\.css$/;

const isCssRules = rule =>
  rule.test &&
  (rule.test.toString() === CSS_PATTERN.toString() ||
    rule.test.toString() === MODULE_CSS_PATTERN.toString());

const filterRules = config => ({
  ...config,
  module: {
    ...config.module,
    rules: config.module.rules.filter(
      rule => !(Array.isArray(rule.oneOf) && rule.oneOf.every(isCssRules))
    ),
  },
});

exports.onCreateWebpackConfig = ({ actions, getConfig }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, '../src'), 'node_modules'],
      alias: {
        Actions: path.resolve(__dirname, '../src/actions/'),
        Images: path.resolve(__dirname, '../src/images/'),
        ApplicationContext: path.resolve(
          __dirname,
          '../src/components/ApplicationContext.js'
        ),
        Constants: path.resolve(__dirname, '../src/constants/'),
        Components: path.resolve(__dirname, '../src/components/'),
        History: path.resolve(__dirname, '../src/history.js'),
        Middlewares: path.resolve(__dirname, '../src/store/middlewares/'),
        Utils: path.resolve(__dirname, '../src/utils/'),
      },
    },
    plugins: [
      new webpack.DefinePlugin({
        __DEV__: true,
        __BROWSER__: false,
        __CONFIG__: JSON.stringify(nodeConfig),
      }),
    ],
  });

  const config = getConfig();
  const filteredRules = filterRules(config);

  filteredRules.module.rules.push({
    test: CSS_PATTERN,
    rules: [
      {
        issuer: { not: [CSS_PATTERN] },
        use: 'isomorphic-style-loader',
      },

      {
        loader: 'css-loader',
        options: {
          importLoaders: 1,
          sourceMap: false,
          modules: {
            localIdentName: '[name]-[local]-[contenthash:base64:5]',
          },
        },
      },

      // Apply PostCSS plugins including autoprefixer
      {
        loader: 'postcss-loader',
        options: {
          config: {
            path: '../tools/postcss.config.js',
          },
        },
      },
    ],
  });

  actions.replaceWebpackConfig(filteredRules);
};
