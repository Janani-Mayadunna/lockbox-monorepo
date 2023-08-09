import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
  generateSalt,
} from '../../utils/helper-functions';
import { SharedVaultDto } from '../user/dto/shared-vault.dto';
import {
  ICreateSharedVault,
  IGetReceivedVaultResponse,
} from '../user/user.interfaces';
import { UserFolder } from '../user-folder/schemas/user-folder.schema';

@Injectable()
export class VaultService {
  constructor(
    @InjectModel(Vault.name)
    private vaultModel: Model<Vault>,
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(UserFolder.name)
    private folderModel: Model<UserFolder>,
    private jwtService: JwtService,
  ) {}

  async createVault(
    vault: ICreateVault,
    userId: string,
  ): Promise<ICreateVaultResponse> {
    const currentUser = await this.userModel.findById(userId);

    if (!currentUser) {
      logger.error(`User not found with id: ${userId}`);
      throw new NotFoundException(`User not found`);
    }

    if (vault.note?.length > 300) {
      throw new BadRequestException(
        'Note length exceeds the limit of 300 characters',
      );
    }

    Object.assign(vault, { user: currentUser._id });

    const newVault: Vault = await this.vaultModel.create(vault);

    currentUser.vaults.push(newVault);

    await currentUser.save();

    if (vault.folder) {
      const selectedFolder = await this.folderModel.findById(vault.folder);
      console.log('vault folder', vault.folder);

      if (!selectedFolder) {
        logger.error(`Folder not found with id: ${vault.folder}`);
        throw new NotFoundException(`Folder not found`);
      }

      Object.assign(vault, { folder: vault.folder });
      selectedFolder.vaults.push(newVault);
      await selectedFolder.save();
    }

    const vaultWithoutPassword: ICreateVaultResponse = {
      username: newVault.username,
      link: newVault.link,
      note: newVault.note,
      folder: newVault.folder,
      category: newVault.category,
      name: newVault.name,
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

  async computeSecret(email: string, userId: string): Promise<string> {
    const userPrivateKey = await this.getUserPrivateKey(userId);
    const otherPublicKey = await this.getOtherUserPublicKey(email);

    const sharedSecret = computeSharedSecret(userPrivateKey, otherPublicKey);
    return sharedSecret;
  }

  async directShareVaultPassword(
    createSharedVaultData: ICreateSharedVault,
    userId: string,
  ): Promise<boolean> {
    const currentUser = await this.userModel.findById(userId);
    if (!currentUser) {
      throw new NotFoundException(`User not found`);
    }

    const senderName = currentUser.name;
    const senderEmail = currentUser.email;

    const OtherUser = await this.userModel.findOne({
      email: createSharedVaultData.receiverEmail,
    });
    if (!OtherUser) {
      return false;
    } else {
      const newSharedVaultData: SharedVaultDto = {
        vaultId: new mongoose.Types.ObjectId(),
        vaultLink: createSharedVaultData.vaultLink,
        vaultUsername: createSharedVaultData.vaultUsername,
        vaultPassword: createSharedVaultData.vaultPassword,
        sharedUserEmail: senderEmail,
        sharedUserName: senderName,
        isAllowedToSave: createSharedVaultData.isAllowedToSave,
      };

      OtherUser.sharedVault.push(newSharedVaultData);
      await OtherUser.save();
      logger.info(
        `Shared vault password with ${createSharedVaultData.receiverEmail}`,
      );

      return true;
    }
  }

  async getReceivedVaults(
    userId: string,
  ): Promise<IGetReceivedVaultResponse[]> {
    const currentUser = await this.userModel.findById(userId);
    if (!currentUser) {
      throw new NotFoundException(`User not found`);
    }

    const receivedVaults: SharedVaultDto[] = currentUser.sharedVault;

    //map through each received vault and compute their secret
    const computedReceivedVaults: IGetReceivedVaultResponse[] =
      await Promise.all(
        receivedVaults.map(async (receivedVault) => {
          const sharedSecret = await this.computeSecret(
            receivedVault.sharedUserEmail,
            userId,
          );
          return {
            ...receivedVault,
            sharedSecret,
          };
        }),
      );

    return computedReceivedVaults;
  }

  async deleteOneReceivedVault(userId: string, deleteVaultData: IDeleteVault) {
    const currentUser = await this.userModel.findById(userId);
    if (!currentUser) {
      throw new NotFoundException(`User not found`);
    }

    // find a vault from currentUsers sharedVault array that matches the deleteVaultData.id
    const vaultToDelete = currentUser.sharedVault.find(
      (vault) => vault.vaultId.toString() === deleteVaultData.id,
    );

    if (!vaultToDelete) {
      throw new NotFoundException(`Vault not found`);
    }

    //remove that from element from user's sharedVault array
    await this.userModel.updateOne(
      { _id: userId },
      { $pull: { sharedVault: vaultToDelete } },
    );

    return vaultToDelete;
  }
}
