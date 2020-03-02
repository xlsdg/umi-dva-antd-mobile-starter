// import _ from 'lodash';
import React from 'react';
// import PropTypes from 'prop-types';
// import ClassNames from 'classnames';
// import Link from 'umi/link';
// import Router from 'umi/router';
// import Redirect from 'umi/redirect';
// import {  } from 'antd-mobile';
// import { formatMessage } from 'umi-plugin-react/locale';

import styles from './index.less';

const HomeLayout = React.memo(props => {
  const { children } = props;

  return <div className={styles.container}>{children}</div>;
});

HomeLayout.propTypes = {};

HomeLayout.defaultProps = {};

export default HomeLayout;
