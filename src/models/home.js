import _ from 'lodash';

import { NS_HOME } from '@/redux/namespaces/index';
import { TYPE_SET_STATE } from '@/redux/types/index';
import { generatePutStateAction } from '@/redux/actions/index';
import HomeActions from '@/redux/actions/home';

import HomeApi from '@/services/home';

import { generateSubscriptionByRoutes, mergeObject, hasArray } from '@/utils/helper';

const InitialState = {
  banner: [],
};

const StateAt = generatePutStateAction(InitialState, 0);
// const StateFrom = generateSelectStateFn(InitialState, 0, NS_HOME);

const Routes = {
  '/': {
    onEnter: ({ dispatch }) => {
      // console.log('Enter /');
      return dispatch(HomeActions.getData());
    },
    onChange: ({ dispatch }) => {
      // console.log('Change /');
      return dispatch(HomeActions.getData());
    },
    onLeave: ({ dispatch }) => {
      // console.log('Leave /');
      return dispatch(StateAt(_.cloneDeep(InitialState)));
    },
  },
};

export default {
  namespace: NS_HOME,
  state: _.cloneDeep(InitialState),
  subscriptions: {
    setup: generateSubscriptionByRoutes(Routes),
  },
  effects: {
    *getData({ payload }, { call, put, race, select, take }) {
      // console.log(payload);
      const resp = yield call(HomeApi.getData, {});
      // console.log(resp);
      if (hasArray(resp.banner)) {
        yield put(StateAt({ banner: resp.banner }));
      }
    },
  },
  reducers: {
    [TYPE_SET_STATE](state, { payload }) {
      mergeObject(state, payload);
      // return mergeObject({}, state, payload);
    },
  },
};
