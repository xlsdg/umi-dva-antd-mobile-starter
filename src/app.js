import _ from 'lodash';
// import { message } from 'antd';
// import { formatMessage } from 'umi-plugin-react/locale';

export const dva = {
  config: {
    // history: ,
    // initialState: {},
    onError: (error, dispatch) => {
      // console.dir(error);
      if (error && _.isFunction(error.preventDefault)) {
        error.preventDefault();
      }
    },
    // onAction: [],
    // onStateChange: ,
    // onReducer: ,
    // onEffect: ,
    // onHmr: ,
    // extraReducers: {  },
    // extraEnhancers: ,
    // models: [],
  },
  // plugins: [],
};

// export function patchRoutes(routes) {
//   console.log(arguments);
// }

// export function render(oldRender) {
//   console.log(arguments);
// }

// export function rootContainer(container) {
//   console.log(arguments);
// }

// export function modifyRouteProps(props, { route }) {
//   console.log(arguments);
// }

// export function onRouteChange({ location, routes, action }) {
//   console.log(arguments);
// }
