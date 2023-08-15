const BASE_URL = 'http://localhost:4000/api';

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
};

export default API;