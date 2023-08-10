export interface Row {
  link: string;
  username: string;
  password: string;
}

export interface ICreateVault {
  link?: string;
  username: string;
  password: string;
  note?: string;
}

export interface IFolder {
  _id: string;
  folderName: string;
}