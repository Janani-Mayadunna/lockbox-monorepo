import { Injectable, NotFoundException } from '@nestjs/common';
import { Vault } from './schemas/vault.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from '../user/schemas/user.schema';
import logger from '../../utils/logger';
import { ObjectId } from 'mongodb';
import { IDeleteVault, IUpdateVault } from './interfaces/vault.interfaces';

@Injectable()
export class VaultService {
  constructor(
    @InjectModel(Vault.name)
    private vaultModel: Model<Vault>,
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async createVault(vault: Vault, userId: string): Promise<Vault> {
    // Retrieve the user document
    const currentUser = await this.userModel.findById(userId);
    if (!currentUser) {
      // Handle user not found
      logger.error(`User not found with id: ${userId}`);
    }

    Object.assign(vault, { user: currentUser._id });

    // Create a new vault
    const newVault: Vault = await this.vaultModel.create(vault);
    // Add the newly created vault to the user's vaults array
    currentUser.vaults.push(newVault);

    // Save the updated user document
    await currentUser.save();
    return newVault;
  }

  async getAllUserVaults(userId: string): Promise<Vault[]> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      logger.error(`User not found with id: ${userId}`);
      console.log('User not found with id: ', userId);
      return [];
    }

    // Retrieve all vaults for the user
    const vaults = await this.vaultModel.find({ user: user._id });

    return vaults;
  }
}
