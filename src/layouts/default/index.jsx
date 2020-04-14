// import _ from 'lodash';
import React from 'react';
// import PropTypes from 'prop-types';
// import ClassNames from 'classnames';
// import { Link, history, Redirect } from 'umi';
// import { Layout } from 'antd';
// import { formatMessage } from 'umi';

// import styles from './index.less';

const DefaultLayout = React.memo(props => {
  const { children } = props;

  return children;
});

DefaultLayout.propTypes = {};

DefaultLayout.defaultProps = {};

export default DefaultLayout;
