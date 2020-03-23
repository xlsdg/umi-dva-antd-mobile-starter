import _ from 'lodash';
// import Axios from 'axios';
// import QueryString from 'qs';
import { message } from 'antd';
import { history } from 'umi';
import UmiRequest from 'umi-request';

import { ResponseError } from './error';
import { hasString, hasPlainObject, hasArray, hasValue, hasStringThen, getValue, mergeObject } from './helper';

export const addAuthorizationToHeader = () => ({ Authorization: 'xxxx' });

export const addTimestampToData = () => ({ _t: _.now() });

export const addAuthCheckerToResponse = response =>
  getValue(response, 'data.code') === 100 ? new ResponseError({ message: 'No Auth!', response }) : response;
export const addCodeCheckerToResponse = response =>
  getValue(response, 'data.code') !== 0 ? new ResponseError({ message: 'Bad Code!', response }) : response;

export const addAuthHandlerToError = error => {
  if (error instanceof ResponseError && getValue(error, 'response.data.code') === 100) {
    // removeUserAuthData();
    history.push('/user/login');
  }
};
export const addMsgHandlerToError = error =>
  error instanceof ResponseError && hasStringThen(getValue(error, 'response.data.msg'), message.error);
export const addActionHandlerToError = handler => error => handler(error);
export const addResponseHandlerToError = error =>
  !(error instanceof ResponseError) && hasStringThen(getValue(error, 'response.statusText'), message.error);
export const addRequestHandlerToError = error =>
  !(error instanceof ResponseError) && hasStringThen(getValue(error, 'request'), message.error);
export const addMessageHandlerToError = error =>
  !(error instanceof ResponseError) &&
  !getValue(error, 'response') &&
  !getValue(error, 'request') &&
  hasStringThen(getValue(error, 'message'), message.error);

function reduceCallback(accumulator, item) {
  const result = _.isFunction(item) ? item(accumulator) : item;
  if (result instanceof Error) {
    throw result;
  }

  return hasPlainObject(result) ? mergeObject(accumulator, result) : accumulator;
}

// use axios
// eslint-disable-next-line max-params
// export function request(method, url, data = {}, options = {}) {
//   const requestOptions = {
//     // url: ,
//     method: method === 'form' ? 'post' : method,
//     // baseURL: ,
//     // transformRequest: [],
//     // transformResponse: [],
//     // headers: {},
//     // params: {},
//     // paramsSerializer: params => Qs.stringify(params, { arrayFormat: 'brackets' }),
//     // data: {},
//     // timeout: 1000,
//     // withCredentials: false,
//     // adapter: config => {},
//     // auth: {
//     //   username: '',
//     //   password: '',
//     // },
//     responseType: 'json',
//     responseEncoding: 'utf8',
//     // xsrfCookieName: 'XSRF-TOKEN',
//     // xsrfHeaderName: 'X-XSRF-TOKEN',
//     // onUploadProgress: progressEvent => {},
//     // onDownloadProgress: progressEvent => {},
//     // maxContentLength: 2000,
//     // maxBodyLength: 2000,
//     // validateStatus: status => {},
//     // maxRedirects: 5,
//     // socketPath: null,
//     // httpAgent: new http.Agent({ keepAlive: true }),
//     // httpsAgent: new https.Agent({ keepAlive: true }),
//     // proxy: {
//     //   host: '127.0.0.1',
//     //   port: 9000,
//     //   auth: {
//     //     username: '',
//     //     password: '',
//     //   },
//     // },
//     // cancelToken:  new CancelToken(cancel => {}),
//     // decompress: true,
//   };

//   if (hasArray(options.header)) {
//     requestOptions.headers = _.reduce(options.header, reduceCallback, {});
//   }

//   let payload = data;
//   if (hasArray(options.data)) {
//     payload = _.reduce(options.data, reduceCallback, _.cloneDeep(data));
//   }

//   if (_.isFunction(options.interceptor)) {
//     [requestOptions.headers, payload] = options.interceptor(requestOptions.headers, payload);
//   }

//   if (_.includes(['get', 'delete'], method)) {
//     requestOptions.params = payload;
//   } else if (method === 'form') {
//     // requestOptions.headers['content-type'] = 'application/x-www-form-urlencoded';
//     requestOptions.data = QueryString.stringify(payload);
//   } else {
//     requestOptions.data = payload;
//   }

//   if (hasString(options.baseURL)) {
//     const ends = _.endsWith(options.baseURL, '/');
//     const starts = _.startsWith(url, '/');

//     if (ends && starts) {
//       requestOptions.baseURL = _.trimEnd(options.baseURL, '/');
//     } else if (!ends && !starts) {
//       requestOptions.baseURL = `${options.baseURL}/`;
//     } else {
//       requestOptions.baseURL = options.baseURL;
//     }
//   }

//   if (_.isFunction(options.cancelToken)) {
//     requestOptions.cancelToken = new Axios.CancelToken(options.cancelToken);
//   }

//   return Axios(url, requestOptions)
//     .then(response => {
//       let resp = response;
//       if (hasArray(options.response)) {
//         resp = _.reduce(options.response, reduceCallback, response);
//       }

//       return resp.data;
//     })
//     .catch(error => {
//       let err = error;
//       // if (UmiRequest.isCancel(error)) {}
//       if (hasArray(options.error)) {
//         err = _.reduce(options.error, reduceCallback, error);
//       }

//       return Promise.reject(err);
//     });
// }

// use umi-request
// eslint-disable-next-line max-params
export function request(method, url, data = {}, options = {}) {
  const requestOptions = {
    method: method === 'form' ? 'post' : method,
    // params: ,
    // paramsSerializer: ,
    // data: ,
    // headers: {},
    // timeout: 1000,
    // prefix: '',
    // suffix: '',
    // credentials: 'same-origin',
    // useCache: false,
    // validateCache: (url, options) => {},
    // ttl: 60000,
    // maxCache: 0,
    requestType: method === 'form' ? 'form' : 'json',
    parseResponse: true,
    charset: 'utf8',
    responseType: 'json',
    throwErrIfParseFail: false,
    getResponse: true,
    // errorHandler: error => {},
    // cancelToken: ,
  };

  if (hasArray(options.header)) {
    requestOptions.headers = _.reduce(options.header, reduceCallback, {});
  }

  let payload = data;
  if (hasArray(options.data)) {
    payload = _.reduce(options.data, reduceCallback, _.cloneDeep(data));
  }

  if (_.isFunction(options.interceptor)) {
    [requestOptions.headers, payload] = options.interceptor(requestOptions.headers, payload);
  }

  if (_.includes(['get', 'delete'], method)) {
    requestOptions.params = payload;
  } else {
    requestOptions.data = payload;
  }

  if (hasString(options.baseURL)) {
    const ends = _.endsWith(options.baseURL, '/');
    const starts = _.startsWith(url, '/');

    if (ends && starts) {
      requestOptions.prefix = _.trimEnd(options.baseURL, '/');
    } else if (!ends && !starts) {
      requestOptions.prefix = `${options.baseURL}/`;
    } else {
      requestOptions.prefix = options.baseURL;
    }
  }

  if (_.isFunction(options.cancelToken)) {
    requestOptions.cancelToken = new UmiRequest.CancelToken(options.cancelToken);
  }

  return UmiRequest(url, requestOptions)
    .then(response => {
      let resp = response;
      if (hasArray(options.response)) {
        resp = _.reduce(options.response, reduceCallback, response);
      }

      return resp.data;
    })
    .catch(error => {
      let err = error;
      // if (UmiRequest.isCancel(error)) {}
      if (hasArray(options.error)) {
        err = _.reduce(options.error, reduceCallback, error);
      }

      return Promise.reject(err);
    });
}

function mergeOptions(methodOptions, urlOptions, dataOptions) {
  const keys = {
    baseURL: 'string',
    header: 'array',
    data: 'array',
    response: 'array',
    error: 'array',
    cancelToken: 'func',
    interceptor: 'func',
  };

  return _.reduce(
    keys,
    (res, type, name) => {
      const temp = _.filter(_.concat(dataOptions[name], urlOptions[name], methodOptions[name]), hasValue);
      if (hasArray(temp)) {
        res[name] = type === 'array' ? temp : temp[0];
      }
      return res;
    },
    {}
  );
}

export const fetch = (method, methodOptions = {}) => (url, urlOptions = {}) => (data, dataOptions = {}) =>
  request(method, url, data, mergeOptions(methodOptions, urlOptions, dataOptions));

export const internalAuthMethodOptions = {
  baseURL: AUTH_HOST,
  header: [addAuthorizationToHeader],
  response: [addAuthCheckerToResponse, addCodeCheckerToResponse],
  error: [addAuthHandlerToError, addMsgHandlerToError],
};

export const internalApiMethodOptions = {
  baseURL: BASE_HOST,
  header: [],
  response: [addCodeCheckerToResponse],
  error: [addMsgHandlerToError],
};

export const externalMethodOptions = {
  // baseURL: '',
};

export default {
  internal: {
    auth: {
      cache: fetch('get', internalAuthMethodOptions),
      get: fetch('get', {
        ...internalAuthMethodOptions,
        data: _.concat(internalAuthMethodOptions.data, addTimestampToData),
      }),
      post: fetch('post', internalAuthMethodOptions),
      form: fetch('form', internalAuthMethodOptions),
    },
    api: {
      cache: fetch('get', internalApiMethodOptions),
      get: fetch('get', {
        ...internalApiMethodOptions,
        data: _.concat(internalApiMethodOptions.data, addTimestampToData),
      }),
      post: fetch('post', internalApiMethodOptions),
      form: fetch('form', internalApiMethodOptions),
    },
  },
  external: {
    auth: {
      cache: fetch('get', externalMethodOptions),
      get: fetch('get', {
        ...externalMethodOptions,
        data: _.concat(externalMethodOptions.data, addTimestampToData),
      }),
      post: fetch('post', externalMethodOptions),
      form: fetch('form', externalMethodOptions),
    },
    api: {
      cache: fetch('get', externalMethodOptions),
      get: fetch('get', {
        ...externalMethodOptions,
        data: _.concat(externalMethodOptions.data, addTimestampToData),
      }),
      post: fetch('post', externalMethodOptions),
      form: fetch('form', externalMethodOptions),
    },
  },
};
