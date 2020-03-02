import React from 'react';
// import PropTypes from 'prop-types';
import ClassNames from 'classnames';

import styles from './index.less';

const Loading = React.memo(props => {
  const { className } = props;

  return <div className={ClassNames(styles.container, className)}>Loading</div>;
});

// Loading.propTypes = {};

// Loading.defaultProps = {};

export default Loading;
