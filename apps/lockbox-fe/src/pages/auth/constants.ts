import ENVIRONMENT from '../../../src/helpers/environment';

const baseUrl = `${ENVIRONMENT.BACKEND_API}/auth`;

const API = {
  LOGIN: {
    path: `${baseUrl}/login`,
    method: 'POST',
  },
  SIGNUP: {
    path: `${baseUrl}/signup`,
    method: 'POST',
  },
  CURRENT_USER: {
    path: `${baseUrl}/auth/current-user`,
    method: 'GET',
  },
};
export default API;
