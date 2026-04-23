const BASE_URL = 'http://localhost:5000/api';

const getToken = () => sessionStorage.getItem('token');

const request = async (method, endpoint, body = null) => {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(BASE_URL + endpoint, options);
  const data = await res.json();

  if (!res.ok) throw { response: { data } };
  return { data };
};

const api = {
  get: (endpoint) => request('GET', endpoint),
  post: (endpoint, body) => request('POST', endpoint, body),
  put: (endpoint, body) => request('PUT', endpoint, body),
  delete: (endpoint) => request('DELETE', endpoint)
};

export default api;