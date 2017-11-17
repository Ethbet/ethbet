function isRequireError(err) {
  let errorMessage = err.toString();
  return errorMessage.indexOf("invalid opcode") >= 0 || errorMessage.indexOf("VM Exception while processing transaction: revert") >= 0;
}

module.exports = isRequireError;