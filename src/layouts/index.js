import React from 'react';
import PropTypes from 'prop-types';
import WithRouter from 'umi/withRouter';

import Header from './header.js';
import Footer from './footer.js';

import styles from './index.less';

function Main({
  children,
  location
}) {
  return (
    <div className={styles.normal}>
      <Header location={location} />
      <Footer
        location={location}
        childrens={children}
      />
    </div>
  );
}

Main.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object.isRequired
};

export default WithRouter(Main);
