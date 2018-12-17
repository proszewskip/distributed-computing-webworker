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

      // Enable importing WebWorkers from Typescript
      if (options.isServer) {
        config.module.rules.push({
          test: /\.worker\.ts$/,
          loader: 'ignore-loader',
        });
      } else {
        config.module.rules.push({
          test: /\.worker\.ts$/,
          use: [
            {
              loader: 'worker-loader',
              options: {
                name: 'static/[hash].worker.js',
                publicPath: '/_next/',
              },
            },
            options.defaultLoaders.babel,
          ],
        });
      }

      // Overcome webpack referencing `window` in chunks
      // https://github.com/zeit/next-plugins/blob/master/packages/next-workers/index.js#L19
      config.output.globalObject =
        "(typeof self !== 'undefined' ? self : this)";

      config.resolve.modules = [
        path.resolve(__dirname, 'src'),
        ...config.resolve.modules,
      ];

      return config;
    },
  }),
);
