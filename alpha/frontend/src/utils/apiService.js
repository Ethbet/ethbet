import axios from 'axios';

let axiosClient = axios.create({});

function get(...args) {
  return axiosClient.get(...args);
}

function post(...args) {
  return axiosClient.post(...args);
}

export const client = {
  get: get,
  post: post
};

export const apiRoot = process.env.REACT_APP_BACKEND_URL + '/api';