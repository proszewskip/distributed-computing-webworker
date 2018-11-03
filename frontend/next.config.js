// NOTE: https://github.com/zeit/next-plugins/tree/master/packages/next-typescript

const path = require('path');

const withTypescript = require('@zeit/next-typescript');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const withCSS = require('@zeit/next-css');

module.exports = withCSS(
  withTypescript({
    webpack(config, options) {
      if (options.isServer) {
        config.plugins.push(new ForkTsCheckerWebpackPlugin());
      }

      config.resolve.modules = [
        path.resolve(__dirname, 'src'),
        ...config.resolve.modules,
      ];

      return config;
    },
  }),
);
