/**
 * title: page.404.title
 */
import React from 'react';
// import { formatMessage } from 'umi-plugin-react/locale';

import styles from './404.less';

const Page = React.memo(props => {
  // const {  } = props;
  return <div className={styles.container}>404</div>;
});

Page.propTypes = {};

Page.defaultProps = {};

export default Page;
