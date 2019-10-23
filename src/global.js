import _ from 'lodash';

if (process.env.NODE_ENV === 'development' || _.includes(['local'], process.env.UMI_ENV)) {
  const VConsole = require('vconsole');
  // eslint-disable-next-line no-new
  new VConsole();
}
