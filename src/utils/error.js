import _ from 'lodash';

export class ResponseError extends Error {
  constructor(props = {}) {
    const { message, response } = props;
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(message || 'ResponseError');

    const that = this;
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(that, ResponseError);
    }

    that.name = 'ResponseError';
    // that.type = '';
    that.timestamp = _.now();
    that.response = response;
  }
}
