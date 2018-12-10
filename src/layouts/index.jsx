import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.less';

function renderHeader(props) {
  return <header className={styles.header}>Header</header>;
}

function renderContent(props) {
  const { children } = props;

  return <main className={styles.content}>{children}</main>;
}

function renderFooter(props) {
  return <footer className={styles.footer}>Footer</footer>;
}

function BasicLayout(props) {
  return (
    <div className={styles.main}>
      {renderHeader(props)}
      {renderContent(props)}
      {renderFooter(props)}
    </div>
  );
}

BasicLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

// BasicLayout.defaultProps = {};

export default BasicLayout;
