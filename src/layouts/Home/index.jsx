// import _ from 'lodash';
import React from 'react';
// import PropTypes from 'prop-types';
// import ClassNames from 'classnames';
// import { Link, history, Redirect } from 'umi';
// import {  } from 'antd-mobile';
// import { formatMessage } from 'umi';

import styles from './index.less';

const HomeLayout = React.memo(props => {
  const { children } = props;

  return <div className={styles.container}>{children}</div>;
});

HomeLayout.propTypes = {};

HomeLayout.defaultProps = {};

export default HomeLayout;
