import _ from 'lodash';

import TYPES from '@/redux/types/index';

import { hasArray, hasString, hasPlainObject, getValue, flattenObject, mergeObject } from '@/utils/helper';

// eslint-disable-next-line max-params
export function actionCreator(error, namespace, type, payload = {}, meta = {}) {
  return {
    error,
    type: (namespace ? `${namespace}/` : '') + type,
    payload,
    meta,
  };
}

export function getActionStart(namespace, type) {
  return hasString(namespace) ? `${namespace}/${type}/@@start` : `${type}/@@start`;
}

export function getActionEnd(namespace, type) {
  return hasString(namespace) ? `${namespace}/${type}/@@end` : `${type}/@@end`;
}

export function generateAction(type) {
  return ({ error, meta, ...others } = {}, namespace) => actionCreator(error, namespace, type, others, meta);
}

export function generateSetStateAction(path, namespace) {
  const setStateAction = generateAction(TYPES.TYPE_SET_STATE);
  return state => setStateAction(hasArray(path) || hasString(path) ? _.set({}, path, state) : state, namespace);
}

export const setStateReducer = {
  [TYPES.TYPE_SET_STATE](state, action) {
    const { payload } = action;
    mergeObject(state, payload); // 开启 immer 之后需要这样设置
    // return mergeObject({}, state, payload); // 未开启 immer 的方式
  },
};

export function generatePutStateAction(state, depth, namespace) {
  if (!hasPlainObject(state) || depth === 0) {
    return generateSetStateAction('', namespace);
  }

  return _.reduce(
    flattenObject(state, depth),
    (acc, v, k) => {
      if (_.split(k, '.').length === depth) {
        acc[_.camelCase(k)] = generateSetStateAction(k, namespace);
      }
      return acc;
    },
    {}
  );
}

export function generateSelectStateFn(state, depth, namespace) {
  if (!hasPlainObject(state) || depth === 0) {
    return state => getValue(state, `${namespace}`);
  }

  return _.reduce(
    flattenObject(state, depth),
    (acc, v, k) => {
      if (_.split(k, '.').length === depth) {
        acc[_.camelCase(k)] = state => getValue(state, `${namespace}.${k}`);
      }
      return acc;
    },
    {}
  );
}

export function generateActionsByTypes(types) {
  return _.reduce(
    types,
    (acc, value, key) => {
      acc[value] = generateAction(value);
      return acc;
    },
    {}
  );
}

// export default {
//   [TYPE_SET_STATE]: setStateAction,
//   [TYPE_ENTER_PAGE]: generateAction(TYPE_ENTER_PAGE),
//   [TYPE_CHANGE_PAGE]: generateAction(TYPE_CHANGE_PAGE),
//   [TYPE_LEAVE_PAGE]: generateAction(TYPE_LEAVE_PAGE),
// };

export default generateActionsByTypes(TYPES);
