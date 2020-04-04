import _ from 'lodash';

import { hasArray, hasString } from '@/utils/helper';

// export const TYPE_SET_STATE = 'setState';
// export const TYPE_ENTER_PAGE = 'enterPage';
// export const TYPE_CHANGE_PAGE = 'changePage';
// export const TYPE_LEAVE_PAGE = 'leavePage';

export function generateTypesByNames(names = []) {
  if (!hasArray(names)) {
    return {};
  }

  return _.reduce(
    _.uniq(names),
    (types, name) => {
      if (hasString(name)) {
        const key = _.toUpper(`TYPE_${_.snakeCase(name)}`);
        types[key] = name;
      }
      return types;
    },
    {}
  );
}

const NAMES = ['setState', 'enterPage', 'changePage', 'leavePage'];
export default generateTypesByNames(NAMES);
