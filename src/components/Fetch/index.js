import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import Request from '@/utils/request';

class Fetch extends React.Component {
  static propTypes = {
    type: PropTypes.oneOf(['get', 'post', 'form', 'put', 'patch', 'delete']).isRequired,
    url: PropTypes.string.isRequired,
    data: PropTypes.object,
    children: PropTypes.func.isRequired,
  };

  static defaultProps = {
    data: null,
  };

  constructor() {
    super(...arguments);
    // console.log('constructor', arguments);
    this.state = {
      error: null,
      loading: true,
      response: null,
    };
  }

  componentDidMount() {
    const that = this;
    // console.log('componentDidMount', that.props, that.state);
    // const {  } = that.props;
    // const {  } = that.state;
    return that.fetch();
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   const that = this;
  //   // console.log('shouldComponentUpdate', that.props, nextProps, that.state, nextState);
  //   // const {  } = that.props;
  //   // const {  } = that.state;

  //   if (_.isEqual(that.props, nextProps) && _.isEqual(that.state, nextState)) {
  //     return false;
  //   }

  //   return true;
  // }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const that = this;
    // console.log('componentDidUpdate', prevProps, that.props, prevState, that.state, snapshot);
    const { type, url, data } = that.props;
    // const {  } = that.state;

    if (type === prevProps.type && url === prevProps.url && _.isEqual(data, prevProps.data)) {
      return;
    }

    return that.fetch();
  }

  componentWillUnmount() {
    const that = this;
    // console.log('componentWillUnmount', that.props, that.state);
    // const {  } = that.props;
    // const {  } = that.state;

    if (_.isFunction(that.cancel)) {
      that.cancel('The component will unmount.');
    }
  }

  fetch = () => {
    const that = this;
    const { type, url, data } = that.props;
    // const {  } = that.state;

    const options = {
      useBaseRequest: false,
      checkCode: false,
      addLocale: false,
      cancelToken: c => {
        that.cancel = c;
      },
    };

    return Request[type](url, data, options)
      .then(response => that.setState({ response, loading: false }))
      .catch(error => that.setState({ error, loading: false }));
  };

  render() {
    const that = this;
    // console.log('render', that.props, that.state);
    const { children } = that.props;
    const { error, loading, response } = that.state;

    return children(error, loading, response);
  }
}

export default Fetch;
