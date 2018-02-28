export default {
  onError(err) {
    err.preventDefault();
    console.error(err.message);
  },
};
