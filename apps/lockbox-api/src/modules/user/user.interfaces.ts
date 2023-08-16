import { ObjectId } from 'mongodb';

export interface ICreateSharedVault {
  vaultUsername: string;
  vaultPassword: string;
  vaultAlias: string;
  vaultLink?: string;
  receiverEmail: string;
  isAllowedToSave: boolean;
}

export interface IGetReceivedVaultData {
  senderEmail: string;
}

export interface IGetReceivedVaultResponse {
  sharedSecret: string;
  vaultId: ObjectId;
  vaultUsername: string;
  vaultPassword: string;
  vaultAlias: string;
  vaultLink?: string;
  sharedUserEmail: string;
  sharedUserName: string;
  isAllowedToSave: boolean;
}
