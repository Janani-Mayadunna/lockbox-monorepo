import { ICreateVault, IFolder, IUpdateVault, IVault } from '../interfaces';
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
import {
  CreateVaultFailure,
  CreateVaultRequest,
  CreateVaultSuccess,
  GetAllFoldersFailure,
  GetAllFoldersRequest,
  GetAllFoldersSuccess,
  GetVaultByIdFailure,
  GetVaultByIdRequest,
  GetVaultByIdSuccess,
  GetVaultRequest,
  GetVaultsFailure,
  GetVaultsFailurePayload,
  GetVaultsSuccess,
  GetVaultsSuccessPayload,
  UpdateVaultFailure,
  UpdateVaultRequest,
  UpdateVaultSuccess,
} from './types';

/* Get all vaults*/
export const getVaultRequest = (
  keyword: string,
  filter: string,
): GetVaultRequest => ({
  type: GET_VAULTS_REQUEST,
  payload: { keyword, filter },
});

export const getVaultSuccess = (
  payload: GetVaultsSuccessPayload,
): GetVaultsSuccess => ({
  type: GET_VAULTS_SUCCESS,
  payload,
});

export const getVaultFailure = (
  payload: GetVaultsFailurePayload,
): GetVaultsFailure => ({
  type: GET_VAULTS_FAILURE,
  payload,
});

/* Create a vault*/
export const createVaultRequest = (
  payload: ICreateVault,
): CreateVaultRequest => ({
  type: CREATE_VAULT_REQUEST,
  payload,
});

export const createVaultSuccess = (payload: any): CreateVaultSuccess => ({
  type: CREATE_VAULT_SUCCESS,
  payload,
});

export const createVaultFailure = (payload: any): CreateVaultFailure => ({
  type: CREATE_VAULT_FAILURE,
  payload,
});

/* Get all folder */
export const getAllFoldersRequest = (): GetAllFoldersRequest => ({
  type: GET_ALL_FOLDERS_REQUEST,
  payload: {},
});

export const getAllFoldersSuccess = (
  payload: IFolder[] | null,
): GetAllFoldersSuccess => ({
  type: GET_ALL_FOLDERS_SUCCESS,
  payload,
});

export const getAllFoldersFailure = (payload: any): GetAllFoldersFailure => ({
  type: GET_ALL_FOLDERS_FAILURE,
  payload,
});

/* Update a vault */
export const updateVaultRequest = (
  payload: {
    id: string;
    data: IUpdateVault;
  },
): UpdateVaultRequest => ({
  type: UPDATE_VAULT_REQUEST,
  payload,
});

export const updateVaultSuccess = (payload: any): UpdateVaultSuccess => ({
  type: UPDATE_VAULT_SUCCESS,
  payload,
});

export const updateVaultFailure = (payload: any): UpdateVaultFailure => ({
  type: UPDATE_VAULT_FAILURE,
  payload,
});

export const getVaultByIdRequest = (
  id: string,
): GetVaultByIdRequest => ({
  type: GET_VAULT_BY_ID_REQUEST,
  payload: id ,
});

export const getVaultByIdSuccess = (payload: IVault): GetVaultByIdSuccess => ({
  type: GET_VAULT_BY_ID_SUCCESS,
  payload,
});

export const getVaultByIdFailure = (payload: any): GetVaultByIdFailure => ({
  type: GET_VAULT_BY_ID_FAILURE,
  payload,
});