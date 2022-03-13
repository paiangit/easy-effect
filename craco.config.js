const path = require('path');
const webpack = require('webpack');
const {
  loaderByName,
  getLoaders,
  removePlugins,
  whenDev,
  whenProd,
} = require('@craco/craco');
const CracoLessPlugin = require('craco-less');
const CracoAliasPlugin = require('craco-alias');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const threadLoader = require('thread-loader');

const smp = new SpeedMeasurePlugin({
  outputFormat: 'human',
  outputTarget: './build/speed-measure.md'
});

// https://webpack.docschina.org/loaders/thread-loader/#root
// https://github.com/webpack-contrib/thread-loader/blob/master/example/webpack.config.js
threadLoader.warmup(
  {
    workers: require('os').cpus().length - 1,
  },
  [
    'babel-loader',
  ]
);

const handleBabelLoader = (webpackConfig, loaderName) => {
  const { hasFoundAny, matches } = getLoaders(
    webpackConfig,
    loaderByName(loaderName),
  );
  if (!hasFoundAny) {
    console.error(`没有找到${loaderName}`);
  }

  matches.forEach(item => {
    // 移除掉CRA默认提供的test为/\.(js|mjs)$/的babel-loader，因为项目中并没有此类型的文件
    if (item.loader.test.toString() === '/\\.(js|mjs)$/') {
      item.parent.splice(item.index, 1);
      return;
    }

    const newItem = {
      // 对于CRA默认提供的test为/\.(js|mjs|jsx|ts|tsx)$/的babel-loader，我们将它的test简化成/\.(tsx|ts)$/，因为项目中只有这两种类型的文件
      test: item.loader.test.toString().indexOf('tsx') > -1  ? /\.(tsx|ts)$/ : item.loader.test,
      use: [
        {
          loader: 'thread-loader',
        },
        {
          loader: 'esbuild-loader',
          options: {
            loader: 'tsx',
            target: 'es2015'
          },
        }
      ]
    };
    item.loader.include && (newItem.include = item.loader.include);
    item.loader.exclude && (newItem.exclude = item.loader.exclude);

    item.parent[item.index] = newItem;
  });
}

// 关于如何用craco进行详细配置的修改，See：
// https://github.com/gsoft-inc/craco/blob/master/packages/craco/README.md#configuration-file
module.exports = {
  // devServer: (devServerConfig, { env, paths, proxy, allowedHost }) => {
  //   return devServerConfig;
  // },

  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // fs.writeFileSync('CRA的默认webpack配置.json', JSON.stringify(webpackConfig, null, 2));

      whenDev(() => {
        // 比默认的cheap-module-source-map打包速度更快
        webpackConfig.devtool = 'eval-cheap-module-source-map';
      });

      whenProd(() => {
        // 生产环境下用hidden-source-map让控制台中只能定位到编译后代码的位置，而不能map到源码，以提高安全性
        webpackConfig.devtool = 'hidden-source-map';
      });

      webpackConfig.entry = path.resolve(__dirname, './src/index.tsx');

      webpackConfig.externals = {
        'lottie-web/build/player/lottie_light': 'lottie'
      };

      webpackConfig.optimization = {
        splitChunks: {
          cacheGroups: {
            commons: {
              chunks: 'initial',
              minChunks: 2,
              maxInitialRequests: 5,
              minSize: 0
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              chunks: 'initial',
              name: 'vendor',
              priority: 10,
              enforce: true
            }
          }
        },
      };

      whenDev(() => {
        webpackConfig.output.filename = '[name].bundle.js';
      });
      whenProd(() => {
        webpackConfig.output.filename = '[name].[contenthash].bundle.js';
      });

      webpackConfig.resolve.extensions = [
        '.tsx',
        '.ts',
        ...webpackConfig.resolve.extensions,
      ];

      handleBabelLoader(webpackConfig, 'babel-loader');

      // 删除case-sensitive-paths-plugin
      whenDev(() => removePlugins(webpackConfig, (plugin) => {
        if (plugin instanceof CaseSensitivePathsPlugin) {
          return plugin;
        }
      }));

      // 只在生产环境下开启包大小分析插件，开发环境下是未压缩的大小，分析不真实
      whenProd(() => {
        webpackConfig.plugins.push(new BundleAnalyzerPlugin({ generateStatsFile: true, openAnalyzer: false }));
      });

      // 是否开启measure-speed-webpack-plugin
      if (process.env.MEASURE === 'true') {
        const smpWrappedConfig = smp.wrap(webpackConfig);

        // 修复生产环境下speed-measure-webpack-plugin与mini-css-extract-plugin的冲突报错：
        // Error: You forgot to add 'mini-css-extract-plugin' plugin
        // 思路：先将经过speed-measure-webpack-plugin处理的mini-css-extract-plugin插件移除，
        // 然后再在其之后新创建一个插件添加进去，参数还用原来的
        // See: https://github.com/stephencookdev/speed-measure-webpack-plugin/issues/167
        whenProd(() => {
          let miniCssExtractPlugin;
          smpWrappedConfig.plugins.forEach((plugin, index) => {
            if (plugin instanceof MiniCssExtractPlugin) {
              [ miniCssExtractPlugin ] = smpWrappedConfig.plugins.splice(index, 1);
            }
          });
          smpWrappedConfig.plugins.push(new MiniCssExtractPlugin({...miniCssExtractPlugin.options}));
        });

        return smpWrappedConfig;
      }
      return webpackConfig;
    },
    plugins: [
      // 循环依赖检测插件
      new CircularDependencyPlugin({
        // 这里之所以要用[\\/]，它实际就是一个正则，是为了兼容Linux系统的/和windows系统给的\。
        // 当 webpack 处理文件路径时，它们始终包含 Unix 系统中的 / 和 Windows 系统中的 \。
        // 单纯滴使用 / 或 \ 会在跨平台使用时产生问题。
        // 参考：https://webpack.docschina.org/plugins/split-chunks-plugin/
        exclude: /[\\/]node_modules[\\/]/,
      }),
      // 换成esbuild-loader之后，
      // 不加这个插件页面会出现Uncaught ReferenceError: React is not defined错误
      new webpack.ProvidePlugin({
        'React': 'react',
      }),
      // 时间转换工具采取dayjs替换moment
      new AntdDayjsWebpackPlugin(),
    ],
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      // 关于craco-less的详细配置，See:
      // https://github.com/DocSpring/craco-less#configuration
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#d3022d',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
    {
      plugin: CracoAliasPlugin,
      options: {
        source: 'tsconfig',
        baseUrl: './src',
        tsConfigPath: './tsconfig.path.json',
      }
    },
  ],
};
