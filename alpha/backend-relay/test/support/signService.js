const ethSigUtil = require('eth-sig-util');
const ethUtil = require('ethereumjs-util');

function sign(privateKey, hexData) {
  let signature = ethSigUtil.personalSign(privateKey, {data: hexData});
  return signature;
}

function buildMessage(data, address) {
  let hexData = ethUtil.bufferToHex(JSON.stringify(data));
  let message = {
    data: hexData,
    sig: sign(new Buffer(address.private, 'hex'), hexData),
    address: address.public
  };
  return message
}

module.exports = {
  sign,
  buildMessage
};