import _ from 'lodash';
import React from 'react';
// import PropTypes from 'prop-types';
import ClassNames from 'classnames';
import { ActivityIndicator } from 'antd-mobile';

import styles from './index.less';

function Loading(props) {
  const { className, children, ...others } = props;

  const activityIndicatorProps = _.pick(others, ['animating', 'size', 'toast', 'text']);
  return (
    <div className={ClassNames(styles.container, className)}>
      <ActivityIndicator className={styles.loading} {...activityIndicatorProps}>
        {children}
      </ActivityIndicator>
    </div>
  );
}

Loading.propTypes = {};

Loading.defaultProps = {};

export default React.memo(Loading);
