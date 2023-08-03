import { Injectable, NotFoundException } from '@nestjs/common';
import { Vault } from './schemas/vault.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from '../user/schemas/user.schema';
import logger from '../../utils/logger';
import {
  ICreateVault,
  ICreateVaultResponse,
  IDeleteVault,
  IUpdateVault,
} from './interfaces/vault.interfaces';
import { JwtService } from '@nestjs/jwt';
import {
  computeSharedSecret,
  generateKeyPair,
  generateSalt,
} from '../../utils/helper-functions';

@Injectable()
export class VaultService {
  constructor(
    @InjectModel(Vault.name)
    private vaultModel: Model<Vault>,
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async createVault(
    vault: ICreateVault,
    userId: string,
  ): Promise<ICreateVaultResponse> {
    // Retrieve the user document
    const currentUser = await this.userModel.findById(userId);
    if (!currentUser) {
      // Handle user not found
      logger.error(`User not found with id: ${userId}`);
      throw new NotFoundException(`User not found`);
    }

    Object.assign(vault, { user: currentUser._id });

    // Create a new vault
    const newVault: Vault = await this.vaultModel.create(vault);
    // Add the newly created vault to the user's vaults array
    currentUser.vaults.push(newVault);

    // Save the updated user document
    await currentUser.save();

    const vaultWithoutPassword: ICreateVaultResponse = {
      username: newVault.username,
      link: newVault.link,
    };

    return vaultWithoutPassword;
  }

  async getAllUserVaults(userId: string): Promise<Vault[]> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    // Retrieve all vaults for the user
    const vaults = await this.vaultModel.find({ user: user._id });

    return vaults;
  }

  async getOneUserVault(userId: string, vaultId: string): Promise<Vault> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    if (user.vaults.length === 0) {
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
      throw new NotFoundException(`User not found`);
    }

    if (user.vaults.length === 0) {
      throw new NotFoundException(`User has no vaults`);
    }

    if (!mongoose.Types.ObjectId.isValid(vaultId)) {
      logger.error(`Invalid vault id: ${vaultId}`);
      throw new NotFoundException(`Invalid vault id`);
    }

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

    if (!deletedVault) {
      throw new NotFoundException(`Vault not found`);
    }

    return deletedVault;
  }

  async shareVaultPassword(encryptedSharedPassword: string): Promise<string> {
    // create one time link valid for 1 minute
    const payload = {
      salt: generateSalt(),
      encryptedSharedPassword,
    };

    const shareToken = await this.jwtService.sign(payload, {
      expiresIn: '1m',
      secret: process.env.JWT_SHARED_SECRET,
    });

    const link = `http://localhost:3000/vault/shared/${shareToken}`;
    return link;
  }

  async verifyShareLink(shareToken: any): Promise<any> {
    try {
      const decoded = await this.jwtService.verify(shareToken, {
        secret: process.env.JWT_SHARED_SECRET,
      });

      if (!decoded) {
        throw new NotFoundException('Could not verify share link');
      }
      return decoded;
    } catch (error) {
      throw new NotFoundException('Could not verify share link');
    }
  }

  // delete later
  getKeyPair() {
    const keyPair = generateKeyPair();
    return keyPair;
  }
  // delete later

  async getOtherUserPublicKey(email: string): Promise<string> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException(`Other user not found`);
    }
    const otherUserPublicKey = user.publicKey;
    return otherUserPublicKey;
  }

  async getUserPrivateKey(userId: string): Promise<Buffer> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User not found to fetch private key`);
    }
    const userPrivateKey = user.privateKey;
    return userPrivateKey;
  }

  async computeSecret(email: string, userId: string) {
    const userPrivateKey = await this.getUserPrivateKey(userId);
    const otherPublicKey = await this.getOtherUserPublicKey(email);

    const sharedSecret = computeSharedSecret(userPrivateKey, otherPublicKey);
    console.log('Shared Secret from service: ', sharedSecret);
    return sharedSecret;
  }
}
