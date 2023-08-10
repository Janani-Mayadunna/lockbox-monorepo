import { Injectable, NotFoundException } from '@nestjs/common';
import { Vault } from '../vault/schemas/vault.schema';
import { User } from '../user/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import {
  ICreateFolder,
  ICreateFolderResponse,
} from './interfaces/user-folder.interfaces';
import logger from '../../utils/logger';
import { UserFolder } from './schemas/user-folder.schema';

@Injectable()
export class UserFolderService {
  constructor(
    @InjectModel(UserFolder.name)
    private folderModel: Model<UserFolder>,
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(Vault.name)
    private vaultModel: Model<Vault>,
    private jwtService: JwtService,
  ) {}

  async createFolder(
    folder: ICreateFolder,
    userId: string,
  ): Promise<ICreateFolderResponse> {
    const currentUser = await this.userModel.findById(userId);

    if (!currentUser) {
      logger.error(`User not found with id: ${userId}`);
      throw new NotFoundException(`User not found`);
    }

    Object.assign(folder, { user: currentUser._id });

    const newFolder: UserFolder = await this.folderModel.create(folder);

    currentUser.folders.push(newFolder);
    await currentUser.save();

    const userFolder: ICreateFolderResponse = {
      folderName: newFolder.folderName,
    };

    return userFolder;
  }

  async getAllUserFolders(userId: string): Promise<UserFolder[]> {
    const currentUser = await this.userModel.findById(userId);

    if (!currentUser) {
      logger.error(`User not found with id: ${userId}`);
      throw new NotFoundException(`User not found`);
    }

    const userFolders = await this.folderModel
      .find({ user: currentUser._id })
      .populate('vaults');

    return userFolders;
  }

  async getFolderById(folderId: string): Promise<UserFolder> {
    const folder = await this.folderModel.findById(folderId);

    if (!folder) {
      logger.error(`Folder not found with id: ${folderId}`);
      throw new NotFoundException(`Folder not found`);
    }

    return folder;
  }

  //   async getAllVaultsInFolder(userId: string): Promise<any> {
  //     const currentUser = await this.userModel.findById(userId);

  //     if (!currentUser) {
  //       logger.error(`User not found with id: ${userId}`);
  //       throw new NotFoundException(`User not found`);
  //     }

  //     const userFolders = await this.folderModel
  //       .find({ user: currentUser._id })
  //       .populate('vaults');

  //     return userFolders;
  //   }
}
