// import _ from 'lodash';
import Redirect from 'umi/redirect';

export default props => {
  const isAuth = true;
  const { location } = props;

  if (isAuth) {
    return <Redirect to={`/list${location.search}`} />;
  } else {
    return props.children;
  }
};
