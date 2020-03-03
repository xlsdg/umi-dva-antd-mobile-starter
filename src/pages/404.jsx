import React from 'react';
// import { formatMessage } from 'umi';

import styles from './404.less';

const Page = React.memo(props => {
  // const {  } = props;
  return <div className={styles.container}>404</div>;
});

Page.propTypes = {};

Page.defaultProps = {};

Page.title = 'page.404.title';

export default Page;
