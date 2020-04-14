import { defineConfig } from 'umi';

import Constant, { CDN_HOST, BASE_PATH } from './constant.prod';

const PUBLIC_PATH = `${CDN_HOST}${BASE_PATH}`;

const define = {
  ...Constant,
};

// https://umijs.org/config/
export default defineConfig({
  base: BASE_PATH,
  cssLoader: {
    modules: {
      localIdentName: '[hash:base64:8]',
    },
  },
  define,
  manifest: {
    basePath: PUBLIC_PATH,
  },
  publicPath: PUBLIC_PATH,
});
