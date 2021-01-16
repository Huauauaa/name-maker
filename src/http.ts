import axios from 'axios';
const http = axios.create({
  baseURL: './api',
  timeout: 60e3,
});

http.interceptors.response.use(
  function resolve(result) {
    const { data } = result;
    return data;
  },
  function reject(data) {
    const { response } = data;
    return Promise.reject(response.data);
  },
);

export default http;
