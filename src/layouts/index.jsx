import _ from 'lodash';
import React from 'react';
// import PropTypes from 'prop-types';
import { useLocation } from 'umi';

import DefaultLayout from './default';
import UserLayout from './user';

import { useDeepCompareEffect } from '@/utils/hook';

const BasicLayout = React.memo(props => {
  const { children } = props;

  const location = useLocation();
  const locationRef = React.useRef(location);
  useDeepCompareEffect(() => {
    if (!_.isEqual(locationRef.current, location)) {
      locationRef.current = location;
      window.scrollTo(0, 0);
    }
  }, [location]);

  let layout = <DefaultLayout>{children}</DefaultLayout>;

  const { pathname } = location;
  const pathString = pathname !== '/' ? _.trimEnd(pathname, '/') : pathname;
  if (_.startsWith(pathString, '/user/')) {
    layout = <UserLayout>{children}</UserLayout>;
  }

  return layout;
});

export default BasicLayout;
