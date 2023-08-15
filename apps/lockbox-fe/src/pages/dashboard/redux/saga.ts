import { authorizedFetch } from '../../../../src/helpers/request-interceptor';
import { ICreateVault, IFolder, IVault } from '../interfaces';
import { call, put, takeLatest } from 'redux-saga/effects';
import { CreateVaultRequest, GetVaults } from './types';
import {
  createVaultFailure,
  createVaultSuccess,
  getAllFoldersFailure,
  getAllFoldersSuccess,
  getVaultFailure,
  getVaultRequest,
  getVaultSuccess,
} from './actions';
import {
  CREATE_VAULT_REQUEST,
  GET_ALL_FOLDERS_REQUEST,
  GET_VAULTS_REQUEST,
} from './actionTypes';
import API from '../constants';

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
  return data;
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

function* vaultSaga() {
  yield takeLatest(GET_VAULTS_REQUEST, fetchVaultsSaga);
  yield takeLatest(CREATE_VAULT_REQUEST, createVaultSaga);
  yield takeLatest(GET_ALL_FOLDERS_REQUEST, fetchFoldersSaga);
}

export default vaultSaga;
