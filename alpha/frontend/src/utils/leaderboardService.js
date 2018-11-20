import {client, apiRoot} from './apiService';


async function loadLeaderboard() {
  let response = await client.get(apiRoot + '/leaderboard');

  return response.data.leaderboard;
}

let leaderboardService = {
  loadLeaderboard,
};

export default leaderboardService;