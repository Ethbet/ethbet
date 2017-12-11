import {client, apiRoot} from './apiService';

import web3Service from './web3Service';

async function createUser(web3, newUser) {
  let newUserData = {
    username: newUser.username
  };

  let message = await web3Service.sign(web3, newUserData);

  let response =  await client.post(apiRoot + '/users', message);

  return response.data.user;
}

async function loadCurrentUser(web3) {
  let response =  await client.get(`${apiRoot}/users/${web3.eth.defaultAccount}`);

  return response.data.user;
}

let userService = {
  createUser,
  loadCurrentUser
};

export default userService;