import qs from 'qs';
import _ from 'lodash';
import Axios from 'axios';
import { getLocale } from 'umi-plugin-react/locale';

// import { toast } from '@/utils/helper';

const reqConfig = {
  withCredentials: true,
};

const Request = Axios.create(reqConfig);

function fetchData(method, url, data, inConfig = false) {
  let cancel = () => {};
  const cancelToken = new Axios.CancelToken(c => {
    cancel = c;
  });

  const promise = inConfig
    ? Request[method](url, {
        params: data,
        cancelToken,
      })
    : Request[method](url, data, {
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

function throwReqError(resp) {
  const error = new Error(resp.statusText);
  error.resp = resp;
  // throw error;
  return Promise.reject(error);
}

function checkStatus(resp) {
  if (resp.status >= 200 && resp.status < 300) {
    return resp;
  }

  // toast(`[${resp.status}]: ${resp.url}`);

  return throwReqError(resp);
}

// function throwSrvError(body) {
//   const error = new Error(body.msg);
//   error.srv = body;
//   // throw error;
//   return Promise.reject(error);
// }

// function checkCode(body) {
//   // if (body.code > 0) {
//   //   switch (body.code) {
//   //     case 302:
//   //       window.location.href = body.data;
//   //       break;
//   //     case 403:
//   //       return throwSrvError(body);
//   //     default:
//   //       toast(`[${body.code}]: ${body.msg}`);
//   //       break;
//   //   }
//   // } else if (body.code < 0) {
//   //   toast(body.msg);
//   // }

//   if (body.code !== 0) {
//     toast(`[${body.code}]: ${body.msg}`);
//     // return throwSrvError(body);
//   }

//   return body;
// }

function handleReqError(err) {
  if (Axios.isCancel(err)) {
    // console.warn('Request canceled', err.message);
    return Promise.reject(err);
  }

  throw err;
}

function handleRequest(req) {
  return {
    cancel: req.cancel,
    promise: req.promise
      .then(checkStatus)
      .then(resp => resp.data)
      // .then(checkCode)
      .catch(handleReqError),
  };
}

export function getJson(url, data) {
  const d = data ? _.cloneDeep(data) : {};
  d.t = _.now();
  d.lang = getLocale();
  return handleRequest(get(url, d));
}

export function postJson(url, data) {
  const d = data ? _.cloneDeep(data) : {};
  d.lang = getLocale();
  return handleRequest(post(url, d));
}

export function postForm(url, data) {
  const d = data ? _.cloneDeep(data) : {};
  d.lang = getLocale();
  return handleRequest(post(url, qs.stringify(d)));
}

export function putJson(url, data) {
  const d = data ? _.cloneDeep(data) : {};
  d.lang = getLocale();
  return handleRequest(put(url, d));
}

export function patchJson(url, data) {
  const d = data ? _.cloneDeep(data) : {};
  d.lang = getLocale();
  return handleRequest(patch(url, d));
}

export function deleteJson(url, data) {
  const d = data ? _.cloneDeep(data) : {};
  d.t = _.now();
  d.lang = getLocale();
  return handleRequest(del(url, d));
}
