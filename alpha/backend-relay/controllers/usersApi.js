const _ = require('lodash');

let userService = require('../lib/userService');

module.exports = {

  createUser: async function createUser(req, res) {
    try {
      let userData = {
        username: req.objectData.username,
        address: req.body.address,
      };

      let user = await userService.createUser(userData);

      res.status(200).json({user: user});
    }
    catch (err) {
      res.status(500).json({message: err.message});
    }
  },

  getUser: async function getUser(req, res) {
    try {
      let user = await userService.getUser(req.params.address);

      res.status(200).json({user: user});
    }
    catch (err) {
      res.status(500).json({message: err.message});
    }
  },


};
