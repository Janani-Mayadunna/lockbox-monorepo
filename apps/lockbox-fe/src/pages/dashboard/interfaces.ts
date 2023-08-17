export interface IFolder {
  _id: string;
  folderName: string;
}

export interface IVault {
  _id: string;
  category?: string;
  name: string;
  folder?: string;
  link?: string;
  username: string;
  password: string;
  note?: string;
}

export interface ICreateVault {
  category?: string;
  name: string;
  folder?: string;
  link?: string;
  username: string;
  password: string;
  note?: string;
}

export enum CategoryTypes {
  LOGIN = 'Login',
  SECRET_NOTE = 'Secret Note',
}
