/**
 * title: page.index.title
 */

import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import ReactDocumentTitle from 'react-document-title';

import styles from './index.less';

export default () => (
  <ReactDocumentTitle title={formatMessage({ id: 'page.index.title' })}>
    <div className={styles.main}>Index</div>
  </ReactDocumentTitle>
);
