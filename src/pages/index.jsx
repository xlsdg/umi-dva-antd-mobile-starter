/**
 * title: page.index.title
 */
import React from 'react';
import { connect } from 'dva';
// import { formatMessage } from 'umi-plugin-react/locale';

import { NS_HOME } from '@/redux/namespaces/index';
import { generateSetStateAction } from '@/redux/actions/index';

import styles from './index.less';

const Page = React.memo(props => {
  // const {  } = props;
  return <div className={styles.container}>Home</div>;
});

Page.propTypes = {};

Page.defaultProps = {};

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

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Page);
