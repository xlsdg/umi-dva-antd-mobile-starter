import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.less';

function BasicLayout(props) {
  const { children } = props;

  return <div className={styles.main}>{children}</div>;
}

BasicLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

// BasicLayout.defaultProps = {};

export default BasicLayout;
