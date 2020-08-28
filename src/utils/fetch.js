import _ from 'lodash';
// import Axios from 'axios';
// import QueryString from 'qs';
import { Toast } from 'antd-mobile';
import { history } from 'umi';
import UmiRequest from 'umi-request';

import { ResponseError } from '@/utils/error';
import { hasString, hasPlainObject, hasArray, hasFunction, hasStringThen, getValue, mergeObject } from '@/utils/helper';

export const addAuthorizationToHeader = async () => ({ Authorization: 'xxxx' });

export const addTimestampToData = async () => ({ _t: _.now() });

export const addAuthCheckerToResponse = response =>
  getValue(response, 'data.code') === 1000 ? new ResponseError({ message: 'No Auth!', response }) : response;
export const addMsgCodeCheckerToResponse = response =>
  getValue(response, 'data.code') !== 0 ? new ResponseError({ message: 'Bad Code!', response }) : response;

export const addAuthHandlerToError = async error => {
  if (error instanceof ResponseError && getValue(error, 'response.data.code') === 100) {
    history.push('/user/login');
  }
};
export const addMsgHandlerToError = error =>
  error instanceof ResponseError && hasStringThen(getValue(error, 'response.data.msg'), Toast.fail);
export const addActionHandlerToError = handler => error => handler(error);
export const addResponseHandlerToError = error =>
  !(error instanceof ResponseError) && hasStringThen(getValue(error, 'response.statusText'), Toast.fail);
export const addRequestHandlerToError = error =>
  !(error instanceof ResponseError) && hasStringThen(getValue(error, 'request'), Toast.fail);
export const addMessageHandlerToError = error =>
  !(error instanceof ResponseError) &&
  !getValue(error, 'response') &&
  !getValue(error, 'request') &&
  hasStringThen(getValue(error, 'message'), Toast.fail);

async function asyncReduce(collection, initialValue) {
  const iteratee = async (prevResult, item) => {
    const nextResult = await prevResult;

    const result = hasFunction(item) ? await item(nextResult) : item;
    if (result instanceof Error) {
      throw result;
    }

    return hasPlainObject(result) ? mergeObject(nextResult, result) : nextResult;
  };

  return await _.reduce(collection, iteratee, Promise.resolve(initialValue));
}

// use axios
// eslint-disable-next-line max-params
// export async function request(method, url, data = {}, options = {}) {
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
//     requestOptions.headers = await asyncReduce(options.header, {});
//   }

//   let payload = _.cloneDeep(data);
//   if (hasArray(options.data)) {
//     payload = await asyncReduce(options.data, payload);
//   }

//   if (hasFunction(options.interceptor)) {
//     [requestOptions.headers, payload] = await options.interceptor(requestOptions.headers, payload);
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
//     const prefix = _.startsWith(url, '/');
//     const suffix = _.endsWith(options.baseURL, '/');

//     if (prefix && suffix) {
//       requestOptions.baseURL = _.trimEnd(options.baseURL, '/');
//     } else if (!prefix && !suffix) {
//       requestOptions.baseURL = `${options.baseURL}/`;
//     } else {
//       requestOptions.baseURL = options.baseURL;
//     }
//   }

//   if (hasFunction(options.cancelToken)) {
//     requestOptions.cancelToken = new Axios.CancelToken(options.cancelToken);
//   }

//   try {
//     const response = await Axios(url, requestOptions);
//     const newResponse = hasArray(options.response) ? await asyncReduce(options.response, response) : response;
//     return newResponse.data;
//   } catch (error) {
//     // if (Axios.isCancel(error)) {}
//     throw hasArray(options.error) ? await asyncReduce(options.error, error) : error;
//   }
// }

// use umi-request
// eslint-disable-next-line max-params
export async function request(method, url, data = {}, options = {}) {
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
    requestOptions.headers = await asyncReduce(options.header, {});
  }

  let payload = _.cloneDeep(data);
  if (hasArray(options.data)) {
    payload = await asyncReduce(options.data, payload);
  }

  if (hasFunction(options.interceptor)) {
    [requestOptions.headers, payload] = await options.interceptor(requestOptions.headers, payload);
  }

  if (_.includes(['get', 'delete'], method)) {
    requestOptions.params = payload;
  } else {
    requestOptions.data = payload;
  }

  if (hasString(options.baseURL)) {
    const prefix = _.startsWith(url, '/');
    const suffix = _.endsWith(options.baseURL, '/');

    if (prefix && suffix) {
      requestOptions.prefix = _.trimEnd(options.baseURL, '/');
    } else if (!prefix && !suffix) {
      requestOptions.prefix = `${options.baseURL}/`;
    } else {
      requestOptions.prefix = options.baseURL;
    }
  }

  if (hasFunction(options.cancelToken)) {
    requestOptions.cancelToken = new UmiRequest.CancelToken(options.cancelToken);
  }

  try {
    const response = await UmiRequest(url, requestOptions);
    const newResponse = hasArray(options.response) ? await asyncReduce(options.response, response) : response;
    return newResponse.data;
  } catch (error) {
    // if (UmiRequest.isCancel(error)) {}
    throw hasArray(options.error) ? await asyncReduce(options.error, error) : error;
  }
}

function mergeOptions(methodOptions, urlOptions, dataOptions) {
  const types = {
    baseURL: 'string',
    header: ['func', 'object'],
    data: ['func', 'object'],
    response: ['func', 'object'],
    error: ['func', 'object'],
    cancelToken: 'func',
    interceptor: 'func',
  };

  const filters = {
    string: hasString,
    func: hasFunction,
    object: hasPlainObject,
  };

  return _.reduce(
    types,
    (opts, type, name) => {
      const all = _.concat(methodOptions[name], urlOptions[name], dataOptions[name]);

      let result = [];
      if (hasString(type)) {
        // 单个
        result = _.filter(all, filters[type]);
      } else if (hasArray(type)) {
        // 多个
        result = _.filter(all, item => {
          for (let i = 0; i < type.length; i++) {
            if (filters[type[i]](item)) {
              return true;
            }
          }
        });
      }

      if (hasArray(result)) {
        opts[name] = hasArray(type) ? result : result[0];
      }
      return opts;
    },
    {}
  );
}

export const fetch = (method, methodOptions = {}) => (url, urlOptions = {}) => (data, dataOptions = {}) =>
  request(method, url, data, mergeOptions(methodOptions, urlOptions, dataOptions));

export const internalApiMethodOptions = {
  baseURL: BASE_HOST,
  header: [],
  response: [addMsgCodeCheckerToResponse],
  error: [addMsgHandlerToError],
};

export const internalAuthMethodOptions = {
  baseURL: AUTH_HOST,
  header: [...internalApiMethodOptions.header, addAuthorizationToHeader],
  response: [...internalApiMethodOptions.response, addAuthCheckerToResponse],
  error: [...internalApiMethodOptions.error, addAuthHandlerToError],
};

export const externalMethodOptions = {
  // baseURL: '',
  // header: [],
  // response: [],
  // error: [],
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