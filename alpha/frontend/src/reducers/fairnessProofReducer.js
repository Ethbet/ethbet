import {Map as ImmutableMap} from 'immutable';


let initialData = {
  fairnessProofs: [],
  loadingFairnessProofs: false
};

export default function fairnessProofReducer(state = new ImmutableMap(initialData), action) {

  const fetchLoadFairnessProofsRequest = (state) => {
    return state
      .set('loadingFairnessProofs', true);
  };

  const fetchLoadFairnessProofsSuccess = (state) => {
    return state
      .set('loadingFairnessProofs', false)
      .set('fairnessProofs', action.fairnessProofs)
  };

  const fetchLoadFairnessProofsFailure = (state) => {
    return state
      .set('loadingFairnessProofs', false);
  };

  const actions = {
    'FETCH_LOAD_FAIRNESS_PROOFS_REQUEST': () => fetchLoadFairnessProofsRequest(state),
    'FETCH_LOAD_FAIRNESS_PROOFS_SUCCESS': () => fetchLoadFairnessProofsSuccess(state),
    'FETCH_LOAD_FAIRNESS_PROOFS_FAILURE': () => fetchLoadFairnessProofsFailure(state),
    'DEFAULT': () => state
  };

  return ((action && actions[action.type]) ? actions[action.type] : actions['DEFAULT'])()
}