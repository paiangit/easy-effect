const CracoLessPlugin = require('craco-less');
const CracoAliasPlugin = require('craco-alias');
const path = require('path/posix');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.entry = path.resolve(__dirname, './src/index.tsx');
      webpackConfig.resolve.extensions = [
        '.tsx',
        '.ts',
        ...webpackConfig.resolve.extensions,
      ];

      return webpackConfig;
    },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
            modifyVars: {
              '@primary-color': '#d3022d',
            },
          }
        }
      },
    },
    {
      plugin: CracoAliasPlugin,
      options: {
        source: 'tsconfig',
        baseUrl: './src',
        tsConfigPath: '.tsconfig.path.json',
      }
    },
  ],
}
