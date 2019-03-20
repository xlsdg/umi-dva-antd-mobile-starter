import qs from 'qs';
import _ from 'lodash';
import Axios from 'axios';
import { getLocale } from 'umi-plugin-react/locale';

const reqConfig = {
  withCredentials: true,
};

const Request = Axios.create(reqConfig);

function fetchData(method, url, data, isDataInConfig = false) {
  const headers = {};

  let cancel = () => {};
  const cancelToken = new Axios.CancelToken(c => {
    cancel = c;
  });

  const promise = isDataInConfig
    ? Request[method](url, {
        params: data,
        headers,
        cancelToken,
      })
    : Request[method](url, data, {
        headers,
        cancelToken,
      });

  return {
    cancel,
    promise,
  };
}

function get(url, data) {
  return fetchData('get', url, data, true);
}

function post(url, data) {
  return fetchData('post', url, data, false);
}

function put(url, data) {
  return fetchData('put', url, data, false);
}

function patch(url, data) {
  return fetchData('patch', url, data, false);
}

function del(url, data) {
  return fetchData('delete', url, data, true);
}

function handleReqError(err, onError) {
  if (Axios.isCancel(err)) {
    return Promise.reject(err);
  }

  if (_.isFunction(onError)) {
    return onError(err);
  }

  return Promise.reject(err);
}

function handleRequest(req, onError) {
  return {
    cancel: req.cancel,
    promise: req.promise.then(resp => resp.data).catch(err => handleReqError(err, onError)),
  };
}

export function getJson(url, data, onError) {
  const d = data ? _.cloneDeep(data) : {};
  d.t = _.now();
  d.lang = getLocale();

  const req = get(url, d);
  return handleRequest(req, onError);
}

export function postJson(url, data, onError) {
  const d = data ? _.cloneDeep(data) : {};
  d.lang = getLocale();

  const req = post(url, d);
  return handleRequest(req, onError);
}

export function postForm(url, data, onError) {
  const d = data ? _.cloneDeep(data) : {};
  d.lang = getLocale();

  const req = post(url, qs.stringify(d));
  return handleRequest(req, onError);
}

export function putJson(url, data, onError) {
  const d = data ? _.cloneDeep(data) : {};
  d.lang = getLocale();

  const req = put(url, d);
  return handleRequest(req, onError);
}

export function patchJson(url, data, onError) {
  const d = data ? _.cloneDeep(data) : {};
  d.lang = getLocale();

  const req = patch(url, d);
  return handleRequest(req, onError);
}

export function deleteJson(url, data, onError) {
  const d = data ? _.cloneDeep(data) : {};
  d.t = _.now();
  d.lang = getLocale();

  const req = del(url, d);
  return handleRequest(req, onError);
}
