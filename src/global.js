import _ from 'lodash';

if (process.env.NODE_ENV === 'development' || _.includes(['local'], process.env.UMI_ENV)) {
  if (!window.VConsole) {
    const VConsole = require('vconsole');
    window.VConsole = new VConsole();
  }
}
