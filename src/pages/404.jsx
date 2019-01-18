/**
 * title: page.404.title
 */

import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import ReactDocumentTitle from 'react-document-title';

import styles from './404.less';

export default () => (
  <ReactDocumentTitle title={formatMessage({ id: 'page.404.title' })}>
    <div className={styles.main}>404</div>
  </ReactDocumentTitle>
);
