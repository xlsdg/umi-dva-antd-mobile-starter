import React from 'react';
// import PropTypes from 'prop-types';
import { Flex } from 'antd-mobile';
import ReactLoading from 'react-loading';

import styles from './index.less';

function ILoading() {
  return (
    <Flex className={styles.loading} justify="center" align="center">
      <div className={styles.loadingIcon}>
        <ReactLoading type="cylon" color="#0078ff" width="100%" height="100%" />
      </div>
    </Flex>
  );
}

// ILoading.propTypes = {};

// ILoading.defaultProps = {};

export default ILoading;
