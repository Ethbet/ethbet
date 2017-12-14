let _ = require('lodash');

async function createUser(userData) {
  let user = await db.User.findOne({
    where: {
      username: userData.username,
    },
  });
  if (user) {
    throw new Error("User already exists");
  }

  user = await db.User.findOne({
    where: {
      address: userData.address,
    },
  });

  // update if exists , create otherwise
  if (user) {
    await user.update(userData);
  }
  else { // insert
    user = await db.User.create(userData);
  }

  return user;
}

async function getUser(userAddress) {
  let user = await db.User.findOne({
    where: {
      address: userAddress
    },
  });

  return user;
}

async function getUsername(address) {
  let user = await db.User.findOne({
    where: {
      address: address,
    },
  });

  return _.get(user, 'username');
}

async function getUsernames(addresses) {
  let users = await db.User.findAll({
    where: {
      address: addresses,
    },
  });

  let usernames = {};
  for (i = 0; i < users.length; i++) {
    let user = users[i];
    usernames[user.address] = user.username;
  }
  return usernames;
}

module.exports = {
  createUser,
  getUser,
  getUsername,
  getUsernames
};