import _ from 'lodash';
// import createCachedSelector from 're-reselect';

import TYPES from '@/redux/types';

import { hasArray, hasString, hasPlainObject, getValue, flattenObject, mergeObject } from '@/utils/helper';

export function actionCreator(props) {
  const { error, namespace, type, payload = {}, meta = {} } = props;
  return {
    error,
    type: `${hasString(namespace) ? `${namespace}/` : ''}${type}`,
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
  return ({ error, meta, ...others } = {}, namespace) =>
    actionCreator({ error, namespace, type, payload: others, meta });
}

export function generateSetStateAction(path, namespace) {
  const setStateAction = generateAction(TYPES.SET_STATE);
  return state => setStateAction(hasArray(path) || hasString(path) ? _.set({}, path, state) : state, namespace);
}

export const setStateReducer = {
  [TYPES.SET_STATE](state, action) {
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

export function generateActionsByTypes(types, options = {}) {
  if (!hasPlainObject(types)) {
    return {};
  }

  return _.reduce(
    types,
    (actions, type) => {
      if (options.start === true || (hasArray(options.start) && _.includes(options.start, type))) {
        actions[`${type}Start`] = namespace => getActionStart(namespace, type);
      }

      actions[type] = generateAction(type);

      if (options.end === true || (hasArray(options.end) && _.includes(options.end, type))) {
        actions[`${type}End`] = namespace => getActionEnd(namespace, type);
      }

      return actions;
    },
    {}
  );
}

export function generateDispatchesByTypes(types, actions, namespace) {
  if (!hasPlainObject(types) || !hasPlainObject(actions)) {
    return () => {};
  }

  return (dispatch, filter) => {
    if (!_.isFunction(dispatch)) {
      return {};
    }

    return _.reduce(
      types,
      (dispatches, type) => {
        if (!hasArray(filter) || (hasArray(filter) && _.includes(filter, type))) {
          dispatches[type] = payload => dispatch(actions[type](payload, namespace));
        }

        return dispatches;
      },
      {}
    );
  };
}

export function createStateSelector(path, namespace) {
  const setStateAction = generateSetStateAction(path, namespace);
  const newPath = hasString(path) ? `${namespace}.${path}` : hasArray(path) ? [namespace, ...path] : namespace;
  return [state => _.get(state, newPath), dispatch => state => dispatch(setStateAction(state))];
}

export default generateActionsByTypes(TYPES);
