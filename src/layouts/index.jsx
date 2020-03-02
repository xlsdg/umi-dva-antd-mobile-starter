import React from 'react';
// import PropTypes from 'prop-types';
import withRouter from 'umi/withRouter';

import HomeLayout from './Home';

// import styles from './index.less';

class BasicLayout extends React.PureComponent {
  // static propTypes = {};

  // static defaultProps = {};

  // constructor() {
  //   super(...arguments);
  //   // console.log('constructor', arguments);
  //   const that = this;
  //   that.state = {};
  // }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const that = this;
    // console.log('componentDidUpdate', prevProps, that.props, prevState, that.state, snapshot);
    const { location } = that.props;
    // const {  } = that.state;

    if (location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    const that = this;
    // console.log('render', that.props, that.state);
    const { location, children } = that.props;
    // const {  } = that.state;

    let layout = <HomeLayout>{children}</HomeLayout>;

    return layout;
  }
}

export default withRouter(BasicLayout);
