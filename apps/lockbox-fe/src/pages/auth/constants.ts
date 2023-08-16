const baseUrl = 'http://localhost:4000/api/auth';

const API = {
  LOGIN: {
    path: `${baseUrl}/login`,
    method: 'POST',
  },
  SIGNUP: {
    path: `${baseUrl}/signup`,
    method: 'POST',
  }
};
export default API;
