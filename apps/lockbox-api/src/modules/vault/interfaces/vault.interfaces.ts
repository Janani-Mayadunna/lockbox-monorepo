import { User } from '../../../modules/user/schemas/user.schema';

export interface IVault {
  _id?: string;
  link: string;
  username: string;
  password: string;
  user: string;
}

export interface ICreateVault {
  link: string;
  username: string;
  password: string;
}

export interface IUpdateVault {
  link?: string;
  username?: string;
  password?: string;
}

export interface IDeleteVault {
  id: string;
}

export interface ICreateVaultResponse {
  username: string;
  link: string;
}
