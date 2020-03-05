import LodashWebpackPlugin from 'lodash-webpack-plugin';

import Constant from './constant';
import Theme from './theme';

const chainWebpack = config => {
  config.plugin('lodash').use(LodashWebpackPlugin, [
    {
      collections: true,
      paths: true,
    },
  ]);
};

// https://umijs.org/zh-CN/plugins/api
const plugins = {
  antd: {
    dark: false,
  },
  dva: {
    immer: true,
    hmr: true,
  },
  locale: {
    // default: 'zh-CN',
    baseNavigator: true,
    antd: true,
    title: true,
    baseSeparator: '-',
  },
};

const define = {
  'process.env.NODE_ENV': process.env.NODE_ENV,
  'process.env.UMI_ENV': process.env.UMI_ENV,

  ...Constant,
};

// https://umijs.org/config/
export default {
  // alias: {},
  // analyze: {},
  // autoprefixer: { flexbox: 'no-2009' },
  // base: '/',
  chainWebpack,
  // cssLoader: {},
  // cssnano: {},
  // copy: [],
  define,
  // devServer: {},
  // devtool: {},
  dynamicImport: {
    loading: '@/components/Loading',
  },
  // exportStatic: { htmlSuffix: false, dynamicRoot: false },
  // externals: {},
  extraBabelPlugins: ['lodash'],
  // extraBabelPresets: [],
  // extraPostCSSPlugins: [],
  // favicon: '/assets/favicon.ico',
  // forkTSCheker: {},
  hash: true,
  // headScripts: [{}, ''],
  history: { type: 'browser' }, // browser、hash、memory
  ignoreMomentLocale: true,
  // inlineLimit: 10000,
  // lessLoader: {},
  // links: [{}],
  // manifest: {
  //   fileName: 'manifest.json',
  //   publicPath: ,
  //   basePath: '/',
  // },
  // metas: [{}],
  // mock: {
  //   exclude: [],
  // },
  // mountElementId: 'root',
  // outputPath: 'dist',
  // plugins: [],
  // presets: [],
  // proxy: {},
  // publicPath: '/',
  // routes: [],
  // runtimePublicPath: false,
  // scripts: [{}, ''],
  // singular: false,
  // ssr: false,
  // styleLoader: {},
  // styles: [],
  targets: { android: 4, ios: 6 },
  // terserOptions: {},
  theme: Theme,
  title: 'ANTD Mobile',

  ...plugins,
};
