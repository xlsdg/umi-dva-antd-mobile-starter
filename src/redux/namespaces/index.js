import _ from 'lodash';

import { hasArray, hasString } from '@/utils/helper';

export function generateNameSpacesByNames(names = []) {
  if (!hasArray(names)) {
    return {};
  }

  return _.reduce(
    _.uniq(names),
    (namespaces, name) => {
      if (hasString(name)) {
        const key = _.toUpper(_.snakeCase(name));
        namespaces[key] = name;
      }
      return namespaces;
    },
    {}
  );
}

const NAMES = ['home'];
export default generateNameSpacesByNames(NAMES);
