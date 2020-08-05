import React from 'react';
// import {  } from 'umi';

import { createConnectSelector } from '@/redux/actions/home';

import styles from './index.less';

function Body(props) {
  // const {  } = props;
  // console.log(props);
  return <div className={styles.container}>Home</div>;
}

Body.propTypes = {};

Body.defaultProps = {};

const Page = createConnectSelector('', null, null, React.memo(Body));

Page.title = 'page.index.title';

export default Page;
