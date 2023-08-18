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
  GET_VAULT_BY_ID_FAILURE,
  GET_VAULT_BY_ID_REQUEST,
  GET_VAULT_BY_ID_SUCCESS,
  UPDATE_VAULT_FAILURE,
  UPDATE_VAULT_REQUEST,
  UPDATE_VAULT_SUCCESS,
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
    case UPDATE_VAULT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case UPDATE_VAULT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case UPDATE_VAULT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
      case GET_VAULT_BY_ID_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case GET_VAULT_BY_ID_SUCCESS:
        return {
          ...state,
          loading: false,
          singleVault: action.payload,
          error: null,
        };
      case GET_VAULT_BY_ID_FAILURE:
        return {
          ...state,
          loading: false,
          singleVault: null,
          error: action.payload.error,
        };
    default:
      return { ...state };
  }
};

export default reducers;
