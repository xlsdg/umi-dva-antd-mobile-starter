// import _ from 'lodash';
import Redirect from 'umi/redirect';

export default props => {
  const { location, children } = props;
  const { pathname, search } = location;

  const isAuth = true;
  return isAuth ? (
    children
  ) : (
    <Redirect to={`/user/login?redirect_uri=${window.encodeURIComponent(`${pathname}${search}`)}`} />
  );
};
