import React from 'react';
import { connect } from 'umi';
// import { formatMessage } from 'umi';

import NAMESPACES from '@/redux/namespaces';
import { generateSetStateAction } from '@/redux/actions';

import styles from './index.less';

const Content = React.memo(props => {
  // const {  } = props;
  // console.log(props);
  return <div className={styles.container}>Home</div>;
});

Content.propTypes = {};

Content.defaultProps = {};

function mapStateToProps(state, ownProps) {
  const namespace = NAMESPACES.HOME;

  return {
    loading: state.loading,
    state: state[namespace],
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const namespace = NAMESPACES.HOME;
  const action = generateSetStateAction('', namespace);

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
