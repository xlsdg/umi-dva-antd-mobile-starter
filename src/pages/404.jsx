/**
 * title: page.404.title
 */
import React from 'react';
// import { formatMessage } from 'umi-plugin-react/locale';

import styles from './404.less';

NotFound.propTypes = {};

NotFound.defaultProps = {};

function NotFound(props) {
  return (
    <div className={styles.container}>404</div>
  );
}

export default NotFound;
