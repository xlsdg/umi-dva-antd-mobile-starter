import _ from 'lodash';
import React from 'react';
// import { connect, useSelector, useDispatch } from 'dva';
import { connect, useSelector, useDispatch } from 'umi';
// import createCachedSelector from 're-reselect';

import TYPES from '@/redux/types';

import {
  hasArray,
  hasString,
  hasPlainObject,
  hasFunction,
  getValue,
  flattenObject,
  mergeObject,
  isEqual,
  noop,
} from '@/utils/helper';

export function actionCreator(props) {
  const { error, namespace, type, payload = {}, meta = {} } = props;
  return {
    error,
    type: `${hasString(namespace) ? `${namespace}/` : ''}${type}`,
    payload,
    meta,
  };
}

export function getActionStart(type, namespace) {
  return hasString(namespace) ? `${namespace}/${type}/@@start` : `${type}/@@start`;
}

export function getActionEnd(type, namespace) {
  return hasString(namespace) ? `${namespace}/${type}/@@end` : `${type}/@@end`;
}

export function generateAction(type) {
  return ({ error, meta, ...others } = {}, namespace) =>
    actionCreator({ error, namespace, type, payload: others, meta });
}

export function generateSetStateAction(path = '', namespace) {
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

export function generateEffectStateSelector(state, depth, namespace) {
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
        actions[`${type}Start`] = namespace => getActionStart(type, namespace);
      }

      actions[type] = generateAction(type);

      if (options.end === true || (hasArray(options.end) && _.includes(options.end, type))) {
        actions[`${type}End`] = namespace => getActionEnd(type, namespace);
      }

      return actions;
    },
    {}
  );
}

export function generateStateSelector(path = '', namespace) {
  const setStateAction = generateSetStateAction(path, namespace);
  const newPath = hasString(path) ? `${namespace}.${path}` : hasArray(path) ? [namespace, ...path] : namespace;
  return [state => _.get(state, newPath), _.memoize(dispatch => state => dispatch(setStateAction(state)))];
}

export function generateUseStateSelector(...args) {
  const [stateSelector, setStateSelector] = generateStateSelector(...args);

  return () => {
    const state = useSelector(stateSelector, isEqual);
    const dispatch = useDispatch();
    const setState = React.useMemo(() => setStateSelector(dispatch), [dispatch]);

    return [state, setState];
  };
}

// eslint-disable-next-line max-params
export function generateDispatchSelector(filter = [], types, actions, namespace) {
  if (!hasPlainObject(types) || !hasPlainObject(actions) || !hasString(namespace)) {
    return [noop, noop];
  }

  const selector = _.reduce(
    types,
    (result, type) => {
      if (!hasArray(filter) || _.includes(filter, type)) {
        result.dispatch[type] = dispatch => payload => dispatch(actions[type](payload, namespace));
        result.loading[type] = loading => getValue(loading, `effects['${namespace}/${type}']`, false);
      }

      return result;
    },
    {
      dispatch: {},
      loading: {},
    }
  );

  const dispatchSelector = _.memoize(dispatch => {
    if (!hasPlainObject(selector.dispatch)) {
      return {};
    }

    return _.mapValues(selector.dispatch, selector => selector(dispatch));
  });

  const loadingSelector = loading => {
    if (!hasPlainObject(selector.loading)) {
      return {};
    }

    return _.mapValues(selector.loading, selector => selector(loading));
  };

  return [dispatchSelector, loadingSelector];
}

export function generateUseDispatchSelector(...args) {
  const [dispatchSelector, loadingSelector] = generateDispatchSelector(...args);
  const newLoadingSelector = state => loadingSelector(state.loading);

  return () => {
    const loading = useSelector(newLoadingSelector, isEqual);
    const dispatch = useDispatch();
    const newDispatch = React.useMemo(() => dispatchSelector(dispatch), [dispatch]);

    return [newDispatch, loading];
  };
}

export function generateConnectSelector(createStateSelector, createDispatchSelector) {
  // eslint-disable-next-line max-params
  return (statePath, dispatchFilter, addonFilter, component) => {
    const [stateSelector, setStateSelector] =
      _.isUndefined(statePath) || statePath === '' || hasString(statePath) // 单个
        ? createStateSelector(statePath)
        : hasArray(statePath) // 多个
        ? createStateSelector()
        : [];
    const [dispatchSelector, loadingSelector] = hasArray(dispatchFilter) ? createDispatchSelector(dispatchFilter) : [];

    const mapStateToProps = (state, ownProps) => {
      const result = {};

      if (hasFunction(stateSelector)) {
        const newState = stateSelector(state);
        if (hasArray(statePath)) {
          result.state = _.pick(newState, statePath);
        } else {
          result.state = newState;
        }
      }

      if (hasFunction(loadingSelector)) {
        result.loading = loadingSelector(state.loading);
      }

      return result;
    };

    const mapDispatchToProps = (dispatch, ownProps) => {
      const result = {};

      if (hasFunction(setStateSelector)) {
        if (hasArray(statePath)) {
          // 多个则不提供 setState
        } else {
          result.setState = setStateSelector(dispatch);
        }
      }

      if (hasFunction(dispatchSelector)) {
        result.dispatchAction = dispatchSelector(dispatch);
      }

      return result;
    };

    const mergeProps = (stateProps, dispatchProps, ownProps) => {
      let addonProps = {};
      if (hasFunction(addonFilter)) {
        const newProps = addonFilter(stateProps, dispatchProps, ownProps);
        if (hasPlainObject(newProps)) {
          addonProps = newProps;
        }
      } else if (hasString(addonFilter)) {
        addonProps[addonFilter] = ownProps[addonFilter];
      } else if (hasArray(addonFilter)) {
        addonProps = _.pick(ownProps, addonFilter);
      }

      return {
        ...stateProps,
        ...dispatchProps,
        ...addonProps,
      };
    };

    return connect(mapStateToProps, mapDispatchToProps, mergeProps)(component);
  };
}

const PageActions = generateActionsByTypes(TYPES);

export const PageEvents = {
  onEnter: ({ dispatch, ...others }) => {
    // console.log('Enter /');
    return dispatch(PageActions.enterPage(others));
  },
  onChange: ({ dispatch, ...others }) => {
    // console.log('Change /');
    return dispatch(PageActions.changePage(others));
  },
  onLeave: ({ dispatch, ...others }) => {
    // console.log('Leave /');
    return dispatch(PageActions.leavePage(others));
  },
};

export default PageActions;
