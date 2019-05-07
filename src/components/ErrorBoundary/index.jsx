import React from 'react';
// import PropTypes from 'prop-types';

export default class ErrorBoundary extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hasError: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: error,
    };
  }

  componentDidCatch(error, info) {
    console.log(error, info);
  }

  render() {
    const that = this;
    const { children } = that.props;
    const { hasError } = that.state;

    if (hasError) {
      return <p>{JSON.stringify(hasError)}</p>;
    }

    return children;
  }
}
