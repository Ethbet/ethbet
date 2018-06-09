const ethSigUtil = require('eth-sig-util');

function auth(req, res, next) {
  const recovered = ethSigUtil.recoverPersonalSignature({data: req.body.data, sig: req.body.sig});

  if (ethSigUtil.normalize(recovered) !== ethSigUtil.normalize(req.body.address)) {
    return res.status(401).json({message: "Not Authorized"});
  }

  try{
    let jsonData = Buffer.from(req.body.data.replace(/^0x/,""), 'hex').toString('utf8');
    req.objectData = JSON.parse(jsonData);
  }
  catch(err){
    return res.status(500).json({message: `Data decode issue: ${err.message}`});
  }

  next();
}

module.exports = auth;