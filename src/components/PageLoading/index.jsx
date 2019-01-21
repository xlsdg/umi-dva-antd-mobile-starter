import React from 'react';
// import PropTypes from 'prop-types';
import { Flex, ActivityIndicator } from 'antd-mobile';

import styles from './index.less';

function PageLoading() {
  return (
    <Flex className={styles.loading} justify="center" align="center">
      <ActivityIndicator size="large" />
    </Flex>
  );
}

// PageLoading.propTypes = {};

// PageLoading.defaultProps = {};

export default PageLoading;
