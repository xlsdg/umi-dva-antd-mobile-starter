import _ from 'lodash';
import React from 'react';

import { isEqual, isPrimitive } from '@/utils/helper';

export function useDeepCompareEffect(effect, deps, depsEqual = isEqual) {
  if (process.env.NODE_ENV !== 'production') {
    if (!(deps instanceof Array) || !deps.length) {
      console.warn('`useDeepCompareEffect` should not be used with no dependencies. Use React.useEffect instead.');
    }

    if (_.every(deps, isPrimitive)) {
      console.warn(
        '`useDeepCompareEffect` should not be used with dependencies that are all primitive values. Use React.useEffect instead.'
      );
    }

    if (typeof depsEqual !== 'function') {
      console.warn('`useDeepCompareEffect` should be used with depsEqual callback for comparing deps list');
    }
  }

  const ref = React.useRef(undefined);

  if (!ref.current || !depsEqual(deps, ref.current)) {
    ref.current = deps;
  }

  React.useEffect(effect, ref.current);
}
