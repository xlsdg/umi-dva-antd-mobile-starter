import { TYPE_SET_LOADING, TYPE_SET_MODAL } from '@/redux/types/index';

export function actionCreator(error, namespace, type, payload = {}, meta = {}) {
  return {
    error,
    type: (namespace ? `${namespace}/` : '') + type,
    payload,
    meta,
  };
}

export function getAction(type) {
  return ({ error, meta, ...others }, namespace) => actionCreator(error, namespace, type, others, meta);
}

export default {
  [TYPE_SET_LOADING]: getAction(TYPE_SET_LOADING),
  [TYPE_SET_MODAL]: getAction(TYPE_SET_MODAL),
};
