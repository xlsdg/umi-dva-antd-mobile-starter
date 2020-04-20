import _ from 'lodash';
// import { message } from 'antd';
// import { formatMessage } from 'umi';
// import { createLogger } from 'redux-logger';

export const dva = {
  config: {
    // history: ,
    // initialState: {},
    onError: (error, dispatch, extension) => {
      // console.dir(error);
      if (error && _.isFunction(error.preventDefault)) {
        error.preventDefault();
      }
    },
    // onAction: [createLogger({})],
    // onStateChange: ,
    // onReducer: ,
    // onEffect: ,
    // onHmr: ,
    // extraReducers: {  },
    // extraEnhancers: ,
    // models: [],
    // namespacePrefixWarning: ,
  },
  // plugins: [],
};

// export function patchRoutes({ routes }) {
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

// export function onRouteChange({ routes, matchedRoutes, location, action }) {
//   console.log(arguments);
// }
