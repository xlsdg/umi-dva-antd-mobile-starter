import { defineConfig } from 'umi';

import Constant, { CDN_HOST, BASE_PATH } from './constant.local';

const PUBLIC_PATH = `${CDN_HOST}${BASE_PATH}`;

const define = {
  'process.env.UMI_ENV': 'local',
  ...Constant,
};

// https://umijs.org/config/
export default defineConfig({
  base: BASE_PATH,
  cssLoader: {
    modules: {
      localIdentName: '[local]--[hash:base64:5]',
    },
  },
  define,
  manifest: {
    basePath: PUBLIC_PATH,
  },
  publicPath: PUBLIC_PATH,
});
