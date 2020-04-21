// import _ from 'lodash';
import React from 'react';
// import PropTypes from 'prop-types';
// import ClassNames from 'classnames';
// import {  } from 'antd-mobile';

import Loading from '@/components/Loading';

import styles from './index.less';

function PageLoading(props) {
  // const {  } = props;
  return <Loading className={styles.container} />;
}

PageLoading.propTypes = {};

PageLoading.defaultProps = {};

export default React.memo(PageLoading);
