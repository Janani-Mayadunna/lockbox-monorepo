import {
  authorizedFetch,
  getVaultKey,
} from '../../../../src/helpers/request-interceptor';
import { ICreateVault, IFolder, IUpdateVault, IVault } from '../interfaces';
import { call, put, takeLatest } from 'redux-saga/effects';
import { CreateVaultRequest, GetVaultByIdRequest, GetVaults, UpdateVaultRequest } from './types';
import {
  createVaultFailure,
  createVaultSuccess,
  getAllFoldersFailure,
  getAllFoldersSuccess,
  getVaultByIdFailure,
  getVaultByIdSuccess,
  getVaultFailure,
  getVaultRequest,
  getVaultSuccess,
  updateVaultFailure,
  updateVaultSuccess,
} from './actions';
import {
  CREATE_VAULT_REQUEST,
  GET_ALL_FOLDERS_REQUEST,
  GET_VAULTS_REQUEST,
  GET_VAULT_BY_ID_REQUEST,
  UPDATE_VAULT_REQUEST,
} from './actionTypes';
import API from '../constants';
import CustomCrypto from '../../../../src/helpers/custom-crypto';

/* Get all */
const fetchVaults = async (keyword: string, filter: string) => {
  const response = await authorizedFetch(
    `${API.GET_VAULTS.path}/?${keyword}=${filter}`,
    {
      method: API.GET_VAULTS.method,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  const data = await response.json();

  const vaultKey = getVaultKey();
  let decryptedNote = '';

  const decryptedData = await Promise.all(
    data.map(async (row: IVault) => {
      const decryptedVaultPW = await CustomCrypto.decrypt(
        vaultKey,
        row.password,
      );

      const decryptedVaultUsername = await CustomCrypto.decrypt(
        vaultKey,
        row.username,
      );

      if (row.note) {
        decryptedNote = await CustomCrypto.decrypt(vaultKey, row.note);
      }

      return {
        ...row,
        password: decryptedVaultPW,
        username: decryptedVaultUsername,
        note: decryptedNote,
      };
    }),
  );

  return decryptedData;
};

export function* fetchVaultsSaga({ payload }: GetVaults): any {
  try {
    const vaults: IVault[] = yield call(
      fetchVaults,
      payload.keyword,
      payload.filter,
    );
    yield put(getVaultSuccess({ vaults }));
  } catch (error: any) {
    yield put(getVaultFailure({ error: error.message }));
  }
}

/* Create vault*/
const createVault = async (payload: ICreateVault) => {
  const response = await authorizedFetch(`${API.CREATE_VAULT.path}`, {
    method: API.CREATE_VAULT.method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return await response.json();
};

export function* createVaultSaga(action: CreateVaultRequest): any {
  try {
    const response = yield call(createVault, action.payload);

    yield put(createVaultSuccess(response));
    yield put(getVaultRequest('', ''));
  } catch (error: any) {
    yield put(createVaultFailure({ error: error.message }));
  }
}

/* Get all folders */
const fetchFolders = async () => {
  const response = await authorizedFetch(`${API.GET_ALL_FOLDERS.path}`, {
    method: API.GET_ALL_FOLDERS.method,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  return data;
};

export function* fetchFoldersSaga(): any {
  try {
    const folders: IFolder[] = yield call(fetchFolders);
    yield put(getAllFoldersSuccess(folders));
  } catch (error: any) {
    yield put(getAllFoldersFailure({ error: error.message }));
  }
}

/* Update vault */
const updateVault = async (payload: { id: string; data: IUpdateVault }) => {
  const response = await authorizedFetch(
    `${API.UPDATE_VAULT.path}/${payload.id}`,
    {
      method: API.UPDATE_VAULT.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  );

  return await response.json();
};

export function* updateVaultSaga(action: UpdateVaultRequest): any {
  try {
    const response = yield call(updateVault, action.payload);

    yield put(updateVaultSuccess(response));
    yield put(getVaultRequest('', ''));
  } catch (error: any) {
    yield put(updateVaultFailure({ error: error.message }));
  }
}

/* Get vault by id */
const getVaultById = async (id: string): Promise<IVault> => {
  const response = await authorizedFetch(`${API.GET_SINGLE_VAULT.path}/${id}`, {
    method: API.GET_SINGLE_VAULT.method,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  const vaultKey = getVaultKey();
  let decryptedNote = '';

  const decryptedVaultPW = await CustomCrypto.decrypt(vaultKey, data.password);

  const decryptedVaultUsername = await CustomCrypto.decrypt(
    vaultKey,
    data.username,
  );

  if (data.note) {
    decryptedNote = await CustomCrypto.decrypt(vaultKey, data.note);
  }

  return {
    ...data,
    password: decryptedVaultPW,
    username: decryptedVaultUsername,
    note: decryptedNote,
  };
};

export function* getVaultByIdSaga(action: GetVaultByIdRequest): any {
  try {
    const vault: IVault = yield call(getVaultById, action.payload);
    yield put(getVaultByIdSuccess(vault));
  } catch (error: any) {
    yield put(getVaultByIdFailure({ error: error.message }));
  }
}

function* vaultSaga() {
  yield takeLatest(GET_VAULTS_REQUEST, fetchVaultsSaga);
  yield takeLatest(CREATE_VAULT_REQUEST, createVaultSaga);
  yield takeLatest(GET_ALL_FOLDERS_REQUEST, fetchFoldersSaga);
  yield takeLatest(UPDATE_VAULT_REQUEST, updateVaultSaga);
  yield takeLatest(GET_VAULT_BY_ID_REQUEST, getVaultByIdSaga);
}

export default vaultSaga;
