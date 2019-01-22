import LodashWebpackPlugin from 'lodash-webpack-plugin';

const chainWebpack = config => {
  config.plugin('lodash').use(LodashWebpackPlugin, [
    {
      collections: true,
      paths: true,
    },
  ]);
};

// https://umijs.org/plugin/umi-plugin-react.html
const plugins = [
  [
    'umi-plugin-react',
    {
      dva: {
        immer: true,
        dynamicImport: true,
        hmr: true,
      },
      antd: true,
      routes: {
        exclude: [],
        // update: () => {},
      },
      locale: {
        default: 'zh-CN',
        baseNavigator: true,
        antd: true,
      },
      library: 'react',
      dynamicImport: {
        // webpackChunkName: true,
        loadingComponent: './components/PageLoading/index.jsx',
        // level: ,
      },
      dll: false, // { include: , exclude: , }
      hardSource: false,
      // pwa: {
      //   manifestOptions: {
      //     srcPath: 'src/manifest.json',
      //   },
      //   workboxPluginMode: 'GenerateSW', // 'InjectManifest'
      //   workboxOptions: {
      //     swSrc: 'src/manifest.json',
      //     swDest: 'service-worker.js',
      //     importWorkboxFrom: 'local',
      //   }
      // },
      hd: true,
      fastClick: true,
      title: {
        defaultTitle: 'ANTD MOBILE',
        // format: '{parent}{separator}{current}',
        // separator: ' - ',
        useLocale: true,
      },
      // chunks: ['umi'],
      // scripts: [{}],
      // headScripts: [{}],
      // metas: [{}],
      // links: [{}],
    },
  ],
];

// https://umijs.org/config/
export default {
  plugins,
  // routes: [],
  // disableRedirectHoist: false,
  history: 'browser', // browser、hash、memory
  outputPath: './dist',
  // base: '/',
  // publicPath: '/',
  runtimePublicPath: false,
  // mountElementId: 'root',
  minimizer: 'uglifyjs', // 'terserjs'
  hash: true,
  targets: { android: 4, ios: 6 },
  // context: {},
  // exportStatic: { htmlSuffix: false, dynamicRoot: false },
  // singular: false,

  chainWebpack,
  theme: { // https://github.com/ant-design/ant-design-mobile/blob/master/components/style/themes/default.less
    '@brand-primary': '#0078ff',
  },
  treeShaking: true,
  // externals: {},
  // alias: {},
  // devServer: {},
  // devtool: {},
  // disableCSSModules: false,
  // disableCSSSourceMap: false,
  // extraBabelPresets: [],
  extraBabelPlugins: ['lodash'],
  // extraBabelIncludes: [],
  // extraPostCSSPlugins: [],
  // cssModulesExcludes: [],
  // copy: [],
  // proxy: {},
  // sass: {},
  ignoreMomentLocale: true,
  // lessLoaderOptions: {},
  // cssLoaderOptions: {},
  // autoprefixer: { browserslist, flexbox: 'no-2019' },
};
