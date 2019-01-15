// import _ from 'lodash';
import Redirect from 'umi/redirect';

export default props => {
  const isAuth = true;
  const { location } = props;

  if (isAuth) {
    return props.children;
  } else {
    return <Redirect to={`/${location.search}`} />;
  }
};
