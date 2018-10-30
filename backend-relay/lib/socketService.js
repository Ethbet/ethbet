let io;

function init(_io) {
  io = _io;
}

function emit(event, data) {
  if(io){
    io.emit(event, data);
  }
}

module.exports = {
  emit,
  init
};