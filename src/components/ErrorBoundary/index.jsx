import React from 'react';
// import PropTypes from 'prop-types';

export default class ErrorBoundary extends React.PureComponent {
  static getDerivedStateFromError(error) {
    return {
      hasError: error,
    };
  }

  constructor() {
    super(...arguments);
    this.state = {
      hasError: null,
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
