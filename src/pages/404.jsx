import React from 'react';
import Link from 'umi/link';
import { formatMessage } from 'umi/locale';
import ReactDocumentTitle from 'react-document-title';

import styles from './404.less';

export default () => (
  <ReactDocumentTitle title={formatMessage({ id: 'page.404.title' })}>
    <div className={styles.main}>404</div>
  </ReactDocumentTitle>
);
