function getIo() {
  return require('../server.js').io;
}

function emit(event, data) {
  getIo().emit(event, data);
}

module.exports = {
  emit: emit
};