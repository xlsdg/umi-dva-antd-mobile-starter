import _ from 'lodash';
import React from 'react';
// import PropTypes from 'prop-types';
import { withRouter } from 'umi';

import HomeLayout from './Home';

import { useDeepCompareEffect } from '@/utils/hook';

// import styles from './index.less';

const BasicLayout = React.memo(props => {
  const { children, location } = props;

  const locationRef = React.useRef(location);
  useDeepCompareEffect(() => {
    if (!_.isEqual(locationRef.current, location)) {
      locationRef.current = location;
      window.scrollTo(0, 0);
    }
  }, [location]);

  let layout = <HomeLayout>{children}</HomeLayout>;

  return layout;
});

export default withRouter(BasicLayout);
