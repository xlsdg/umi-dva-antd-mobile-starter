import VConsoleWebpackPlugin from 'vconsole-webpack-plugin';

const chainWebpack = config => {
  config.plugin('vconsole').use(VConsoleWebpackPlugin, [
    {
      enable: true,
    },
  ]);
};

const CDN_HOST = '';
const BASE_PATH = '/';
const PUBLIC_PATH = `${CDN_HOST}${BASE_PATH}`;

const define = {
  BASE_HOST: 'https://dev.baidu.com',
  // BASE_HOST: 'http://127.0.0.1:8080',
};

// https://umijs.org/config/
export default {
  base: BASE_PATH,
  publicPath: PUBLIC_PATH,
  cssPublicPath: PUBLIC_PATH,

  chainWebpack,
  define,
  manifest: {
    basePath: PUBLIC_PATH,
  },
};
