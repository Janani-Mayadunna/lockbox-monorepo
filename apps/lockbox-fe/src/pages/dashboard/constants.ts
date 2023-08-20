import ENVIRONMENT from "../../../src/helpers/environment";

const BASE_URL = `${ENVIRONMENT.BACKEND_API}`;

const API = {
  GET_VAULTS: {
    path: `${BASE_URL}/vault`,
    method: 'GET',
  },
  CREATE_VAULT: {
    path: `${BASE_URL}/vault`,
    method: 'POST',
  },
  GET_ALL_FOLDERS: {
    path: `${BASE_URL}/user-folder`,
    method: 'GET',
  },
  UPDATE_VAULT: {
    path: `${BASE_URL}/vault`,
    method: 'PUT',
  },
  GET_SINGLE_VAULT: {
    path: `${BASE_URL}/vault/vaults`,
    method: 'GET',
  },
};

export default API;
