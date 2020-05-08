import _ from 'lodash';

import NAMESPACES from '@/redux/namespaces';
import { PageEvents, generatePutStateAction, setStateReducer } from '@/redux/actions';

import HomeActions from '@/redux/actions/home';
import * as HomeTransforms from '@/transforms/home';

import { generateSubscriptionByRoutes, hasArray } from '@/utils/helper';

const InitialState = {
  banner: [],
};

const StateAt = generatePutStateAction(InitialState, 0);
// const StateFrom = generateEffectStateSelector(InitialState, 0, NAMESPACES.HOME);

const Routes = {
  '/': PageEvents,
};

// action: error, type, payload, meta
// effects: take, put, all, race, call, apply, cps, fork, spawn, join, cancel, select,
//          actionChannel, cancelled, flush, getContext, setContext, takeEvery, takeLatest, throttle
export default {
  namespace: NAMESPACES.HOME,
  state: _.cloneDeep(InitialState),
  subscriptions: {
    setup: generateSubscriptionByRoutes(Routes),
  },
  effects: {
    *enterPage(action, effects) {
      // const { payload } = action;
      const { put } = effects;

      yield put(HomeActions.getData());
    },
    *changePage(action, effects) {
      // const { payload } = action;
      const { put } = effects;

      yield put(HomeActions.getData());
    },
    *leavePage(action, effects) {
      // const { payload } = action;
      const { put } = effects;

      yield put(StateAt(_.cloneDeep(InitialState)));
    },
    *getData(action, effects) {
      const { payload } = action;
      const { put, call } = effects;

      // console.log(payload);
      const resp = yield call(HomeTransforms.getData, payload);
      // console.log(resp);
      if (hasArray(resp.banner)) {
        yield put(StateAt({ banner: resp.banner }));
      }
    },
  },
  reducers: setStateReducer,
};
