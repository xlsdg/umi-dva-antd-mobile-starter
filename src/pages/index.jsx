import React from 'react';
import { connect } from 'umi';
// import {  } from 'umi';

import { createStateSelector } from '@/redux/actions/home';

import styles from './index.less';

function Body(props) {
  // const {  } = props;
  // console.log(props);
  return <div className={styles.container}>Home</div>;
}

Body.propTypes = {};

Body.defaultProps = {};

const [stateSelector, setStateSelector] = createStateSelector('');
// const [dispatchSelector, loadingSelector] = createDispatchSelector();

function mapStateToProps(state, ownProps) {
  return {
    state: stateSelector(state),
    // loading: loadingSelector(state.loading),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    // dispatch, // 默认不打开，在这个函数里处理 dispatch
    setState: setStateSelector(dispatch),
    // ...dispatchSelector(dispatch),
  };
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  // const { location } = ownProps;

  return {
    ...stateProps,
    ...dispatchProps,
  };
}

const Page = connect(mapStateToProps, mapDispatchToProps, mergeProps)(React.memo(Body));

Page.title = 'page.index.title';

export default Page;
