import _ from 'lodash';

import { NS_HOME } from '@/redux/namespaces/index';
import { TYPE_SET_STATE } from '@/redux/types/index';
import PageActions, { generatePutStateAction } from '@/redux/actions/index';

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
  },
};

export default {
  namespace: NS_HOME,
  state: _.cloneDeep(InitialState),
  subscriptions: {
    setup: generateSubscriptionByRoutes(Routes),
  },
  effects: {
    *enterPage({ payload }, { call, put, race, select, take }) {
      yield put(HomeActions.getData());
    },
    *changePage({ payload }, { call, put, race, select, take }) {
      yield put(HomeActions.getData());
    },
    *leavePage({ payload }, { call, put, race, select, take }) {
      yield put(StateAt(_.cloneDeep(InitialState)));
    },
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
