import _ from 'lodash';
import Axios from 'axios';
import QueryString from 'qs';

import { ReqError } from './error';
import { getLocale, getToken } from './helper';

export const defaultRequestOptions = {
  useBaseRequest: true,
  checkCode: true,
  addTimeStamp: false,
  addLocale: true,
  dataInConfig: false,
  tokenInHeader: false,
  tokenInData: false,
  errorAction: null,
  cancelToken: c => {},
};

const baseRequestConfig = {
  // url: ,
  // method: ,
  baseURL: BASE_HOST,
  // transformRequest: ,
  // transformResponse: [],
  // headers: {},
  // params: {},
  // paramsSerializer: ,
  // data: {},
  // timeout: 1000,
  // withCredentials: false,
  // adapter: function(config) {},
  // auth: {
  //   username: '',
  //   password: '',
  // },
  // responseType: 'json',
  // responseEncoding: 'utf8',
  // xsrfCookieName: 'XSRF-TOKEN',
  // xsrfHeaderName: 'X-XSRF-TOKEN',
  // onUploadProgress: function(progressEvent) {},
  // onDownloadProgress: function(progressEvent) {},
  // maxContentLength: 2000,
  // validateStatus: ,
  // maxRedirects: 5,
  // socketPath: null,
  // httpAgent: ,
  // httpsAgent: ,
  // proxy: {
  //   host: '127.0.0.1',
  //   port: 9000,
  //   auth: {
  //     username: '',
  //     password: '',
  //   },
  // },
  // cancelToken: ,
};
const generalRequestConfig = {};

const BaseRequest = Axios.create(baseRequestConfig);
const GeneralRequest = Axios.create(generalRequestConfig);

function handleRequestHeaders(headers, options = {}) {
  if (options.tokenInHeader) {
    headers.token = getToken();
  }

  return headers;
}

function handleRequestData(data, options = {}) {
  if (options.addTimeStamp) {
    data.t = _.now();
  }

  if (options.addLocale) {
    data.lang = getLocale(true);
  }

  if (options.tokenInData) {
    data.token = getToken();
  }

  return data;
}

function fetchData(method, url, data, options = {}) {
  const headers = handleRequestHeaders({}, options);
  const request = options.useBaseRequest ? BaseRequest : GeneralRequest;
  const cancelToken = _.isFunction(options.cancelToken) ? new Axios.CancelToken(options.cancelToken) : null;

  return options.dataInConfig
    ? request[method](url, {
        params: data,
        headers,
        cancelToken,
      })
    : request[method](url, data, {
        headers,
        cancelToken,
      });
}

function get(url, data, options) {
  return fetchData('get', url, data, options);
}

function post(url, data, options) {
  return fetchData('post', url, data, options);
}

function put(url, data, options) {
  return fetchData('put', url, data, options);
}

function patch(url, data, options) {
  return fetchData('patch', url, data, options);
}

function del(url, data, options) {
  return fetchData('delete', url, data, options);
}

function handleRequest(req, options = {}) {
  const onCheckCode = resp => {
    if (!options.checkCode) {
      return resp;
    }

    if (_.get(resp, 'data.code') !== 0) {
      return Promise.reject(
        new ReqError('srvCode', {
          request: req,
          response: resp,
          options,
        })
      );
    }

    return resp;
  };

  const onError = error => {
    if (Axios.isCancel(error)) {
      // error.preventDefault();
      return Promise.resolve(true);
    }

    if (error instanceof ReqError) {
      throw error;
    }

    throw new ReqError('axios', {
      request: req,
      response: error,
      options,
    });
  };

  return req
    .then(onCheckCode)
    .then(resp => resp.data)
    .catch(onError);
}

export function getJson(url, data, options = {}) {
  const d = data ? _.cloneDeep(data) : {};
  const opts = {
    ...defaultRequestOptions,
    ...options,
    addTimeStamp: true,
    dataInConfig: true,
  };

  const req = get(url, handleRequestData(d, opts), opts);
  return handleRequest(req, opts);
}

export function postJson(url, data, options = {}) {
  const d = data ? _.cloneDeep(data) : {};
  const opts = {
    ...defaultRequestOptions,
    ...options,
  };

  const req = post(url, handleRequestData(d, opts), opts);
  return handleRequest(req, opts);
}

export function postForm(url, data, options = {}) {
  const d = data ? _.cloneDeep(data) : {};
  const opts = {
    ...defaultRequestOptions,
    ...options,
  };

  const req = post(url, QueryString.stringify(handleRequestData(d, opts)), opts);
  return handleRequest(req, opts);
}

export function putJson(url, data, options = {}) {
  const d = data ? _.cloneDeep(data) : {};
  const opts = {
    ...defaultRequestOptions,
    ...options,
  };

  const req = put(url, handleRequestData(d, opts), opts);
  return handleRequest(req, opts);
}

export function patchJson(url, data, options = {}) {
  const d = data ? _.cloneDeep(data) : {};
  const opts = {
    ...defaultRequestOptions,
    ...options,
  };

  const req = patch(url, handleRequestData(d, opts), opts);
  return handleRequest(req, opts);
}

export function deleteJson(url, data, options = {}) {
  const d = data ? _.cloneDeep(data) : {};
  const opts = {
    ...defaultRequestOptions,
    ...options,
    addTimeStamp: true,
    dataInConfig: true,
  };

  const req = del(url, handleRequestData(d, opts), opts);
  return handleRequest(req, opts);
}

export default {
  get: getJson,
  post: postJson,
  form: postForm,
  put: putJson,
  patch: patchJson,
  delete: deleteJson,
};
