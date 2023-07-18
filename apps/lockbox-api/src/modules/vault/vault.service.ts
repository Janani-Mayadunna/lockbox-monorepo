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

  async getOneUserVault(userId: string, vaultId: string): Promise<Vault> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      logger.error(`User not found with id: ${userId}`);
      return null;
    }

    if (user.vaults.length === 0) {
      logger.error(`User has no vaults`);
      throw new NotFoundException(`User has no vaults`);
    }

    // Retrieve the vault for the user
    const vault = await this.vaultModel.findOne({
      user: user._id,
      _id: vaultId,
    });

    return vault;
  }

  async updateOneUserVault(
    userId: string,
    vaultId: string,
    UpdateVaultData: IUpdateVault,
  ): Promise<Vault> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      logger.error(`User not found with id: ${userId}`);
      return null;
    }

    if (user.vaults.length === 0) {
      logger.error(`User has no vaults`);
      throw new NotFoundException(`User has no vaults`);
    }

    if (!mongoose.Types.ObjectId.isValid(vaultId)) {
      logger.error(`Invalid vault id: ${vaultId}`);
      throw new NotFoundException(`Invalid vault id: ${vaultId}`);
    }

    //if vaultId is not in user's vaults array, throw error

    // Retrieve the vault for the user
    const updatedVault = await this.vaultModel.findOneAndUpdate(
      {
        user: user._id,
        _id: vaultId,
      },
      UpdateVaultData,
      { new: true },
    );

    return updatedVault;
  }

  async deleteOneUserVault(
    userId: string,
    deleteVaultData: IDeleteVault,
  ): Promise<Vault> {
    //remove that from element from user's vaults array
    await this.userModel.updateOne(
      { _id: userId },
      { $pull: { vaults: deleteVaultData.id } },
    );

    // Retrieve the vault for the user
    const deletedVault = await this.vaultModel.findOneAndDelete({
      user: userId,
      _id: deleteVaultData.id,
    });

    // //remove that from element from user's vaults array
    // user.vaults.pull(deletedVault._id);
    // await user.save();

    return deletedVault;
  }
}
