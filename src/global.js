if (process.env.NODE_ENV === 'development' || process.env.UMI_ENV === 'local') {
  if (!window.VConsole) {
    const VConsole = require('vconsole');
    window.VConsole = new VConsole();
  }
}
