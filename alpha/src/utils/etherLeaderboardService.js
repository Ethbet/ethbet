import {client, apiRoot} from './apiService';


async function loadLeaderboard() {
  let response = await client.get(apiRoot + '/ether-leaderboard');

  return response.data.leaderboard;
}

let etherLeaderboardService = {
  loadLeaderboard,
};

export default etherLeaderboardService;