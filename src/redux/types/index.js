import _ from 'lodash';

import { hasArray, hasString } from '@/utils/helper';

export function generateTypesByNames(names = []) {
  if (!hasArray(names)) {
    return {};
  }

  return _.reduce(
    _.uniq(names),
    (types, name) => {
      if (hasString(name)) {
        const key = _.toUpper(_.snakeCase(name));
        types[key] = name;
      }
      return types;
    },
    {}
  );
}

const NAMES = ['setState', 'enterPage', 'changePage', 'leavePage'];
export default generateTypesByNames(NAMES);
