import { ICreateVault, IFolder, IVault } from '../interfaces';
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

/* STATE OF VAULT */
export interface VaultState {
  vaults: IVault[] | null;
  folders: any;
  singleVault: IVault | null;
  loading: boolean;
  error: any;
}

/* Get all vaults */
export type GetVaultRequest = {
  type: typeof GET_VAULTS_REQUEST;
  payload: {
    keyword: string;
    filter: string;
  };
};

export type GetVaultsSuccess = {
  type: typeof GET_VAULTS_SUCCESS;
  payload: GetVaultsSuccessPayload;
};

export interface GetVaultsSuccessPayload {
  vaults: IVault[] | null;
}

export type GetVaultsFailure = {
  type: typeof GET_VAULTS_FAILURE;
  payload: GetVaultsFailurePayload;
};

export interface GetVaultsFailurePayload {
  error: any;
}

export interface GetVaults {
  payload: GetVaultsParams;
  type: string;
}

export interface GetVaultsParams {
  keyword: string;
  filter: string;
}

/* Create a vault */
export type CreateVaultRequest = {
  type: typeof CREATE_VAULT_REQUEST;
  payload: ICreateVault;
};

export type CreateVaultSuccess = {
  type: typeof CREATE_VAULT_SUCCESS;
  payload: any;
};

export type CreateVaultFailure = {
  type: typeof CREATE_VAULT_FAILURE;
  payload: any;
};

/* Get all folder */
export type GetAllFoldersRequest = {
  type: typeof GET_ALL_FOLDERS_REQUEST;
  payload: {};
};

export type GetAllFoldersSuccess = {
  type: typeof GET_ALL_FOLDERS_SUCCESS;
  payload: IFolder[] | null;
};

export type GetAllFoldersFailure = {
  type: typeof GET_ALL_FOLDERS_FAILURE;
  payload: any;
};

export type VaultAction =
  | GetVaultRequest
  | GetVaultsSuccess
  | GetVaultsFailure
  | CreateVaultRequest
  | CreateVaultSuccess
  | CreateVaultFailure
  | GetAllFoldersRequest
  | GetAllFoldersSuccess
  | GetAllFoldersFailure;
