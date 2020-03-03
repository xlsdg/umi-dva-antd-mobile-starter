import React from 'react';
import { connect } from 'dva';
// import { formatMessage } from 'umi';

import { NS_HOME } from '@/redux/namespaces/index';
import { generateSetStateAction } from '@/redux/actions/index';

import styles from './index.less';

const Content = React.memo(props => {
  // const {  } = props;
  // console.log(props);
  return <div className={styles.container}>Home</div>;
});

Content.propTypes = {};

Content.defaultProps = {};

function mapStateToProps(state, ownProps) {
  return {
    loading: state.loading,
    state: state[NS_HOME],
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const action = generateSetStateAction('', NS_HOME);
  return {
    // dispatch, // 默认不打开，在这个函数里处理 dispatch
    setState: state => dispatch(action(state)),
  };
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  // const { location } = ownProps;

  return {
    ...stateProps,
    ...dispatchProps,
  };
}

const Page = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Content);

Page.title = 'page.index.title';

export default Page;
