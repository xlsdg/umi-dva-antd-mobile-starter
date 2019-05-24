import React from 'react';
// import PropTypes from 'prop-types';
import { Col, Row, Spin } from 'antd';

import styles from './index.less';

function Loading(props) {
  return (
    <Row className={styles.loadingContainer} type="flex" align="middle" justify="center">
      <Col className={styles.loading}>
        <Spin {...props} />
      </Col>
    </Row>
  );
}

// Loading.propTypes = {};

// Loading.defaultProps = {};

export default Loading;
