import { ICreateVault, IFolder } from '../interfaces';
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
import {
  CreateVaultFailure,
  CreateVaultRequest,
  CreateVaultSuccess,
  GetAllFoldersFailure,
  GetAllFoldersRequest,
  GetAllFoldersSuccess,
  GetVaultRequest,
  GetVaultsFailure,
  GetVaultsFailurePayload,
  GetVaultsSuccess,
  GetVaultsSuccessPayload,
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
