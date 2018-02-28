export default {
  proxy: {
    '/api': {
      target: 'http://jsonplaceholder.typicode.com/',
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    }
  },
  theme: {
    'primary-color': '#7546c9'
  },
  ignoreMomentLocale: true
};
