import axios from 'axios';

export const client =  axios.create({});

export const apiRoot =  process.env.BACKEND_URL;