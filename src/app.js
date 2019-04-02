// import { message } from 'antd';
// import { formatMessage } from 'umi-plugin-react/locale';

export const dva = {
  config: {
    onError: (error, dispatch) => {
      error.preventDefault();
      // message.error(formatMessage({ id: 'page.404.request' }));
    },
  },
  // plugins: [],
};
