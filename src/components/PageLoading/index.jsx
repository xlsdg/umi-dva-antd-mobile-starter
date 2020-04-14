// import _ from 'lodash';
import React from 'react';
// import PropTypes from 'prop-types';
// import ClassNames from 'classnames';
// import Link from 'umi/link';
// import Router from 'umi/router';
// import Redirect from 'umi/redirect';
// import {  } from 'antd';
// import { formatMessage } from 'umi-plugin-react/locale';

import Loading from '@/components/Loading';

import styles from './index.less';

const PageLoading = React.memo(props => {
  // const {  } = props;
  return <Loading className={styles.container} />;
});

PageLoading.propTypes = {};

PageLoading.defaultProps = {};

export default PageLoading;
