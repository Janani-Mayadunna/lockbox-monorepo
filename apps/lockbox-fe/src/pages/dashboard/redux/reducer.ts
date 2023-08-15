import {
  CREATE_VAULT_FAILURE,
  CREATE_VAULT_REQUEST,
  CREATE_VAULT_SUCCESS,
  GET_ALL_FOLDERS_FAILURE,
  GET_ALL_FOLDERS_REQUEST,
  GET_ALL_FOLDERS_SUCCESS,
  GET_VAULTS_FAILURE,
  GET_VAULTS_REQUEST,
  GET_VAULTS_SUCCESS,
} from './actionTypes';
import { VaultAction, VaultState } from './types';

const initialState: VaultState = {
  vaults: [],
  folders: [],
  singleVault: null,
  loading: false,
  error: null,
};

const reducers = (state = initialState, action: VaultAction) => {
  switch (action.type) {
    case GET_VAULTS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_VAULTS_SUCCESS:
      return {
        ...state,
        loading: false,
        vaults: action.payload.vaults,
        error: null,
      };
    case GET_VAULTS_FAILURE:
      return {
        ...state,
        loading: false,
        vaults: null,
        error: action.payload.error,
      };
    case CREATE_VAULT_REQUEST:
      return {
        ...state,
        loading: true,
        vault: action.payload,
      };
    case CREATE_VAULT_SUCCESS:
      return {
        ...state,
        loading: false,
        vault: action.payload,
        error: null,
      };
    case CREATE_VAULT_FAILURE:
      return {
        ...state,
        loading: false,
        vault: null,
        error: action.payload.error,
      };
    case GET_ALL_FOLDERS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_ALL_FOLDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        folders: action.payload,
        error: null,
      };
    case GET_ALL_FOLDERS_FAILURE:
      return {
        ...state,
        loading: false,
        folders: null,
        error: action.payload.error,
      };
    default:
      return { ...state };
  }
};

export default reducers;
