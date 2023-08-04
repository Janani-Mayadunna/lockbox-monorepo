import { ObjectId } from 'mongodb';

export interface ICreateSharedVault {
  vaultUsername: string;
  vaultPassword: string;
  receiverEmail: string;
}

export interface IGetReceivedVaultData {
  senderEmail: string;
}

export interface IGetReceivedVaultResponse {
  sharedSecret: string;
  vaultId: ObjectId;
  vaultUsername: string;
  vaultPassword: string;
  sharedUserEmail: string;
  sharedUserName: string;
}
