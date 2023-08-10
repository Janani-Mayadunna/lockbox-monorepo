import { UserFolder } from 'src/modules/user-folder/schemas/user-folder.schema';

export interface IVault {
  _id?: string;
  link?: string;
  username: string;
  password: string;
  user: string;
  note?: string;
}

export interface ICreateVault {
  link?: string;
  username: string;
  password: string;
  note?: string;
  folder: UserFolder;
  category?: string;
  name: string;
}

export interface IUpdateVault {
  link?: string;
  username?: string;
  password?: string;
  note?: string;
  folder?: UserFolder;
  category?: string;
  name?: string;
}

export interface IDeleteVault {
  id: string;
}

export interface ICreateVaultResponse {
  username: string;
  link: string;
  note?: string;
  folder?: UserFolder;
  category: string;
  name?: string;
}

export interface IGetVaultOptions {
  category?: string;
  folder?: string;
  name?: string;
  username?: string;
}
