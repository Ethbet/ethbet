let socketService = require('./socketService');

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

module.exports = {
  createUser,
  getUser,
};