import _ from 'lodash';
import { pathToRegexp } from 'path-to-regexp';
import FastDeepEqual from 'fast-deep-equal/es6/react';

const TypeOf = type => object => Object.prototype.toString.call(object) === `[object ${type}]`;

// const isString = TypeOf('String');
// const isObject = TypeOf('Object');
// const isFunction = TypeOf('Function');
export const isBlob = TypeOf('Blob');

export const isPrimitive = val => val !== Object(val);

export const isEqual = FastDeepEqual;

export const noop = () => {};

// export function px2Rem(px) {
//   return px / 100;
// }

// export function px2RemStr(px) {
//   return `${px2Rem(px)}rem`;
// }

export function hasString(value) {
  return _.isString(value) && !_.isEmpty(value);
}

export function hasNumber(value) {
  return _.isNumber(value) && _.isFinite(value);
}

export function hasDate(value) {
  return _.isDate(value);
}

export function hasArray(value) {
  return _.isArray(value) && !_.isEmpty(value);
}

export function hasPlainObject(value) {
  return _.isPlainObject(value) && !_.isEmpty(value);
}

export function hasValue(value) {
  return !_.isNil(value);
}

export function hasStringThen(value, trueResult, falseResult) {
  return ifCall(value, hasString, trueResult, falseResult);
}

export function hasArrayThen(value, trueResult, falseResult) {
  return ifCall(value, hasArray, trueResult, falseResult);
}

export function hasPlainObjectThen(value, trueResult, falseResult) {
  return ifCall(value, hasPlainObject, trueResult, falseResult);
}

export function hasValueThen(value, trueResult, falseResult) {
  return ifCall(value, hasValue, trueResult, falseResult);
}

export function hasFunctionCall(value, ...args) {
  return _.isFunction(value) ? value(...args) : value;
}

// eslint-disable-next-line max-params
export function ifCall(value, condition, trueResult, falseResult) {
  if (_.isFunction(condition)) {
    if (condition(value)) {
      return _.isFunction(trueResult) ? trueResult(value) : trueResult;
    } else {
      return _.isFunction(falseResult) ? falseResult(value) : falseResult;
    }
  } else {
    if (condition) {
      return _.isFunction(trueResult) ? trueResult(value) : trueResult;
    } else {
      return _.isFunction(falseResult) ? falseResult(value) : falseResult;
    }
  }
}

// export function forBreak(collection, iteratee, defaultValue) {
//   if (!hasArray(collection)) {
//     return collection;
//   }

//   for (let i = 0; i < collection.length; i++) {
//     const ret = iteratee(collection[i], i, collection);
//     if (ret) {
//       return collection[i];
//     }
//   }

//   return defaultValue;
// }

export function getValue(object, path, ...defaultValues) {
  const value = _.get(object, path);
  if (hasValue(value)) {
    return value;
  }

  return _.find(defaultValues, hasValue);
  // return forBreak(defaultValues, hasValue, value);

  // for (let i = 0; i < defaultValues.length; i++) {
  //   if (hasValue(defaultValues[i])) {
  //     return defaultValues[i];
  //   }
  // }

  // return value;
}

export function mergeDeep(obj, init = {}) {
  return _.reduce(
    obj,
    (acc, value, key) => {
      if (
        _.isString(value) ||
        _.isNumber(value) ||
        _.isBoolean(value) ||
        _.isNull(value) ||
        _.isUndefined(value) ||
        _.isSymbol(value) ||
        _.isFunction(value)
      ) {
        acc[key] = value;
      } else if (hasPlainObject(value) && hasPlainObject(acc[key])) {
        acc[key] = mergeDeep(value, acc[key]);
      } else {
        acc[key] = _.cloneDeep(value);
      }
      return acc;
    },
    init
  );
}

export function mergeObject(object, ...sources) {
  let res = object;
  _.each(sources, src => {
    res = mergeDeep(src, res);
  });
  return res;
}

// export function mergeObject(...args) {
//   return _.mergeWith(...args, customizerMerge);
// }

// export function assignObject(...args) {
//   return _.assignWith(...args, customizerAssign);
// }

export function formatQuery(query) {
  if (!_.isString(query) || query.length < 2) {
    return '';
  }

  if (!_.startsWith(query, '?')) {
    return `?${query}`;
  }

  return query;
}

// export function customizerMerge(objValue, srcValue, key, object, source, stack) {
//   // console.log('customizerMerge:', objValue, srcValue, key, object, source, stack);
//   // 修复 undefined 不能覆盖有值(BUG)
//   if (_.isUndefined(srcValue)) {
//     return srcValue;
//   }

//   // 修复空数组不能覆盖有数组
//   if ((_.isArray(srcValue) || _.isArrayBuffer(srcValue) || _.isArrayLikeObject(srcValue)) && _.isEmpty(srcValue)) {
//     return srcValue;
//   }

//   // 修复空对象不能覆盖有对象
//   if (_.isPlainObject(srcValue) && _.isEmpty(srcValue)) {
//     return srcValue;
//   }
// }

// export function customizerAssign(objValue, srcValue, key, object, source, stack) {
//   // console.log('customizerAssign:', objValue, srcValue, key, object, source, stack);
//   // 修复有对象完全覆盖有对象
//   if (hasPlainObject(objValue) && hasPlainObject(srcValue)) {
//     return srcValue;
//   }
// }

export function flattenObject(obj, depth, prefix = '') {
  const limit = _.isInteger(depth);
  return _.reduce(
    _.keys(obj),
    (acc, k) => {
      const pre = prefix.length ? prefix + '.' : '';
      if ((limit ? depth > 1 : true) && hasPlainObject(obj[k])) {
        _.assign(acc, flattenObject(obj[k], limit ? depth - 1 : depth, pre + k));
      } else {
        acc[pre + k] = obj[k];
      }
      return acc;
    },
    {}
  );
}

export function upperObjectKey(obj) {
  return _.reduce(
    obj,
    (e, v, k) => {
      e[_.toUpper(k)] = hasPlainObject(v) ? upperObjectKey(v) : v;
      return e;
    },
    {}
  );
}

export function generateSubscriptionByRoutes(routes) {
  const pathName = _.keys(routes);
  // const asyncCall = fn => (...args) => window.setTimeout(() => fn(...args));

  return ({ dispatch, history }, onError) => {
    if (!hasPlainObject(routes)) {
      return;
    }

    let prevPathName = null;
    // eslint-disable-next-line complexity
    return history.listen((location, action) => {
      const { pathname: currPathName } = location;
      const event = { location, action, dispatch, onError };

      if (prevPathName === currPathName) {
        return;
      }

      for (let i = 0; i < pathName.length; i++) {
        const path = pathName[i];
        // console.log('\t@path:', path, '\t@prevPathName:', prevPathName, '\t@currPathName:', currPathName);

        const regexp = pathToRegexp(path);
        const prevMatch = regexp.exec(prevPathName);
        const currMatch = regexp.exec(currPathName);
        // console.log('\t@prevMatch:', prevMatch, '\t@currMatch:', currMatch);

        // 原地变参
        if (hasArray(prevMatch) && hasArray(currMatch) && prevMatch.length === currMatch.length) {
          // const prev = routes[prevMatch.length > 1 ? path : prevPathName];
          // if (hasPlainObject(prev) && _.isFunction(prev.onLeave)) {
          //   asyncCall(prev.onLeave)(_.assign({}, event, { match: prevMatch }), prev.context)
          //     .then(() => {
          //       prev.context = {};
          //     })
          //     .catch(onError);
          // }

          const curr = routes[currMatch.length > 1 ? path : currPathName];
          if (hasPlainObject(curr) && _.isFunction(curr.onChange)) {
            // curr.context = {};
            asyncCall(curr.onChange)(_.assign({}, event, { match: currMatch }), curr.context).catch(onError);
          }

          continue;
        }

        // 离开
        if (hasArray(prevMatch) && currMatch === null) {
          const prev = routes[prevMatch.length > 1 ? path : prevPathName];
          if (hasPlainObject(prev) && _.isFunction(prev.onLeave)) {
            asyncCall(prev.onLeave)(_.assign({}, event, { match: prevMatch }), prev.context)
              .then(() => {
                prev.context = {};
              })
              .catch(onError);
          }

          continue;
        }

        // 进入
        if (prevMatch === null && hasArray(currMatch)) {
          const curr = routes[currMatch.length > 1 ? path : currPathName];
          if (hasPlainObject(curr) && _.isFunction(curr.onEnter)) {
            curr.context = {};
            asyncCall(curr.onEnter)(_.assign({}, event, { match: currMatch }), curr.context).catch(onError);
          }

          continue;
        }
      }

      prevPathName = currPathName;
    });
  };
}

export function getRandomString(prefix = 'random') {
  return `${prefix}_${_.now()}_${Math.random()
    .toString(36)
    .substring(2)}`;
}

export function getRandomLengthString(len = 10) {
  let str = Math.random()
    .toString(36)
    .substring(2);

  while (str.length < len) {
    str += Math.random()
      .toString(36)
      .substring(2);
  }

  return str.substring(0, len);
}

export function generateDataSetByData(data) {
  return _.reduce(
    data,
    (r, v, k) => {
      const key = _.toString(k);
      const value = JSON.stringify(v);
      if (hasString(key) && hasString(value)) {
        r[`data-${key}`] = value;
      }
      return r;
    },
    {}
  );
}

export function getDataSetByEvent(event) {
  return _.mapValues(_.toPlainObject(getValue(event, 'target.dataset', {})), v => {
    try {
      return JSON.parse(v);
    } catch (error) {
      return v;
    }
  });
}

export function asyncCall(fn, timeout = 0) {
  return (...args) =>
    new Promise((resolve, reject) =>
      window.setTimeout(() => {
        try {
          resolve(fn(...args));
        } catch (error) {
          reject(error);
        }
      }, timeout)
    );
}

export function getSearchStringByUri(uri) {
  const search = uri.split('?');
  return search.length < 2 ? '' : search[1];
}

export function getQueryObjectByUri(uri) {
  const params = getSearchStringByUri(uri || window.location.search).split('&');
  const result = {};

  for (let i = 0, len = params.length; i < len; i++) {
    const param = params[i].split('=');
    const paramLen = param.length;

    if (param[0].length < 1) {
      continue;
    }

    if (paramLen === 1) {
      result[param[0]] = undefined;
    } else if (paramLen > 1) {
      const value = window.decodeURIComponent(param[1]);
      result[param[0]] = value === 'undefined' ? undefined : value;
    }
  }

  return result;
}

export function setQueryObjectToUri(obj) {
  if (!hasPlainObject(obj)) {
    return '';
  }

  const arrUri = [];

  _.forOwn(obj, (value, key) => {
    if (_.isFunction(value)) {
      return;
    }

    arrUri.push(
      `${window.encodeURIComponent(_.toString(key))}=${window.encodeURIComponent(
        _.isObjectLike(value) ? JSON.stringify(value) : value
      )}`
    );
  });

  return _.join(arrUri, '&');
}

export function getCharLength(str = '') {
  return `${str}`.replace(/[^\x00-\xff]/g, 'xx').length;
}
