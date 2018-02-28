import React from 'react';
// import PropTypes from 'prop-types';
import {
  connect
} from 'dva';

import styles from './page01.less';

function Page01(props) {
  return (
    <div className={styles.normal}>
      Route Component: Page01
    </div>
  );
}

// Page01.propTypes = {
// };

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Page01);
