import {action, createRequestTypes} from '../utils/actionUtils';

export const LOAD_FAIRNESS_PROOFS = 'LOAD_FAIRNESS_PROOFS';
export const loadFairnessProofs = data => action(LOAD_FAIRNESS_PROOFS, data);

export const FETCH_LOAD_FAIRNESS_PROOFS = createRequestTypes('FETCH_LOAD_FAIRNESS_PROOFS');
export const fetchLoadFairnessProofs = {
  request: () => action(FETCH_LOAD_FAIRNESS_PROOFS.REQUEST),
  success: (data) => action(FETCH_LOAD_FAIRNESS_PROOFS.SUCCESS, data),
  failure: (error) => action(FETCH_LOAD_FAIRNESS_PROOFS.FAILURE, error),
};

