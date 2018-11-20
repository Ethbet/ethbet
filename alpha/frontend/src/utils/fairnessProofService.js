import {client, apiRoot} from './apiService';


async function loadFairnessProofs() {
  let response = await client.get(apiRoot + '/fairness-proofs');

  return response.data.fairnessProofs;
}

let fairnessProofService = {
  loadFairnessProofs,
};

export default fairnessProofService;