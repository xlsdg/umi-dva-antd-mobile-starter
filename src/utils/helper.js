import _ from 'lodash';
import React from 'react';
import PathToRegexp from 'path-to-regexp';
// import FastDeepEqual from 'fast-deep-equal/es6/react';
import { dequal as FastDeepEqual } from 'dequal';

// const TypeOf = type => object => Object.prototype.toString.call(object) === `[object ${type}]`;

// const isString = TypeOf('String');
// const isObject = TypeOf('Object');
// const isFunction = TypeOf('Function');
// export const isBlob = TypeOf('Blob');

export const isPrimitive = val => val !== Object(val);

export const isEqual = FastDeepEqual;

export const noop = () => {};

export function hasString(value) {
  return _.isString(value) && !_.isEmpty(value);
}

export function hasNumber(value) {
  return _.isNumber(value) && _.isFinite(value) && !_.isNaN(value);
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

export function hasBoolean(value) {
  return _.isBoolean(value);
}

export function hasFunction(value) {
  return _.isFunction(value);
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
  return hasFunction(value) ? value(...args) : value;
}

// eslint-disable-next-line max-params
export function ifCall(value, condition, trueResult, falseResult) {
  if (hasFunction(condition)) {
    if (condition(value)) {
      return hasFunction(trueResult) ? trueResult(value) : trueResult;
    } else {
      return hasFunction(falseResult) ? falseResult(value) : falseResult;
    }
  } else {
    if (condition) {
      return hasFunction(trueResult) ? trueResult(value) : trueResult;
    } else {
      return hasFunction(falseResult) ? falseResult(value) : falseResult;
    }
  }
}

export function getValue(object, path, ...defaultValues) {
  const value = _.get(object, path);
  if (hasValue(value)) {
    return value;
  }

  return _.find(defaultValues, hasValue);
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
  if (!_.isPlainObject(object)) {
    return;
  }

  return _.reduce(sources, (res, src) => (hasPlainObject(src) ? mergeDeep(src, res) : res), object);
}

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

export function generateSubscriptionByRoutes(routes) {
  const pathName = _.keys(routes);
  // const asyncCall = fn => (...args) => window.setTimeout(() => fn(...args));
  if (!hasPlainObject(routes)) {
    return;
  }

  return ({ dispatch, history }, onError) => {
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

        const regexp = PathToRegexp(path);
        const prevMatch = regexp.exec(prevPathName);
        const currMatch = regexp.exec(currPathName);
        // console.log('\t@prevMatch:', prevMatch, '\t@currMatch:', currMatch);

        // 原地变参
        if (hasArray(prevMatch) && hasArray(currMatch) && prevMatch.length === currMatch.length) {
          // const prev = routes[prevMatch.length > 1 ? path : prevPathName];
          // if (hasPlainObject(prev) && hasFunction(prev.onLeave)) {
          //   asyncCall(prev.onLeave)(_.assign({}, event, { match: prevMatch }), prev.context)
          //     .then(() => {
          //       prev.context = {};
          //     })
          //     .catch(onError);
          // }

          const curr = routes[currMatch.length > 1 ? path : currPathName];
          if (hasPlainObject(curr) && hasFunction(curr.onChange)) {
            // curr.context = {};
            asyncCall(curr.onChange)(_.assign({}, event, { match: currMatch }), curr.context).catch(onError);
          }

          continue;
        }

        // 离开
        if (hasArray(prevMatch) && currMatch === null) {
          const prev = routes[prevMatch.length > 1 ? path : prevPathName];
          if (hasPlainObject(prev) && hasFunction(prev.onLeave)) {
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
          if (hasPlainObject(curr) && hasFunction(curr.onEnter)) {
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

export function memoComponent(fnComponent, propsAreEqual = FastDeepEqual) {
  return React.memo(fnComponent, propsAreEqual);
}
