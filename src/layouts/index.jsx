import React from 'react';
import PropTypes from 'prop-types';
import withRouter from 'umi/withRouter';

import styles from './index.less';

class BasicLayout extends React.Component {
  state = {};

  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  static defaultProps = {};

  componentDidUpdate(prevProps) {
    const that = this;
    const { location } = that.props;

    if (location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  renderHeader = () => {
    return <header className={styles.header}>Header</header>;
  };

  renderContent = () => {
    const that = this;
    const { children } = that.props;

    return <main className={styles.content}>{children}</main>;
  };

  renderFooter = () => {
    return <footer className={styles.footer}>Footer</footer>;
  };

  render() {
    const that = this;

    return (
      <div className={styles.main}>
        {that.renderHeader()}
        {that.renderContent()}
        {that.renderFooter()}
      </div>
    );
  }
}

export default withRouter(BasicLayout);
