// import _ from 'lodash';
import Redirect from 'umi/redirect';

export default props => {
  const { children } = props;

  const isAuth = true;
  return isAuth ? <Redirect to="/" /> : children;
};
