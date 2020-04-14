import _ from 'lodash';
import React from 'react';
// import PropTypes from 'prop-types';
import { withRouter } from 'umi';

import DefaultLayout from './default';
import UserLayout from './user';

import { useDeepCompareEffect } from '@/utils/hook';

const BasicLayout = React.memo(props => {
  const { children, location } = props;

  const locationRef = React.useRef(location);
  useDeepCompareEffect(() => {
    if (!_.isEqual(locationRef.current, location)) {
      locationRef.current = location;
      window.scrollTo(0, 0);
    }
  }, [location]);

  let layout = <DefaultLayout location={location}>{children}</DefaultLayout>;

  const { pathname } = location;
  const pathString = pathname !== '/' ? _.trimEnd(pathname, '/') : pathname;
  if (_.startsWith(pathString, '/user/')) {
    layout = <UserLayout location={location}>{children}</UserLayout>;
  }

  return layout;
});

export default withRouter(BasicLayout);
