import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { VaultService } from './vault.service';
import { AuthGuard } from '@nestjs/passport';
import { Vault } from './schemas/vault.schema';
import { CreateVaultDto } from './dto/create-vault.dto';
import { getCurrentUserId } from '../auth/decorators/currentUserId';
import { UpdateVaultDto } from './dto/update-vault.dto';
import { deleteVaultDto } from './dto/delete-vault.dto';
import { ICreateVaultResponse } from './interfaces/vault.interfaces';

@Controller('vault')
export class VaultController {
  constructor(private vaultService: VaultService) {}

  //retrieve all vaults in the array and display
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAllUserVaults(@getCurrentUserId() userId: string): Promise<Vault[]> {
    return await this.vaultService.getAllUserVaults(userId);
  }

  @Get('/key')
  async generateKeyPair(): Promise<any> {
    return this.vaultService.getKeyPair();
  }

  //verify password share link validity and expiration
  @Get('/verify-link/:id')
  async getSharedLink(@Param('id') shareToken: string): Promise<any> {
    return await this.vaultService.verifyShareLink(shareToken);
  }

  //retrieve a single vault in the array and display
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getOneUserVault(
    @getCurrentUserId() userId: string,
    @Param('id') vaultId: string,
  ): Promise<Vault> {
    return await this.vaultService.getOneUserVault(userId, vaultId);
  }

  //create a 1 vault in the vaults array of user
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createVault(
    @Body() vault: CreateVaultDto,
    @getCurrentUserId() userId: string,
  ): Promise<ICreateVaultResponse> {
    return await this.vaultService.createVault(vault, userId);
  }

  @Post('/shared-secret')
  @UseGuards(AuthGuard('jwt'))
  async computeSecret(
    @getCurrentUserId() userId: string,
    @Body() { email },
  ): Promise<any> {
    return this.vaultService.computeSecret(email, userId);
  }

  @Post('get-key')
  async getOtherUserPublicKey(@Body() { email }): Promise<any> {
    return this.vaultService.getOtherUserPublicKey(email);
  }

  // share a password
  @Post('/shared')
  @UseGuards(AuthGuard('jwt'))
  async getSharedVault(
    @Body() encryptedSharedPassword: string,
  ): Promise<string> {
    return await this.vaultService.shareVaultPassword(encryptedSharedPassword);
  }

  //update a single vault in the array and display
  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateOneUserVault(
    @getCurrentUserId() userId: string,
    @Param('id') vaultId: string,
    @Body() UpdateVaultData: UpdateVaultDto,
  ): Promise<Vault> {
    return await this.vaultService.updateOneUserVault(
      userId,
      vaultId,
      UpdateVaultData,
    );
  }

  //delete a single vault in the array and display
  @Delete('/delete')
  @UseGuards(AuthGuard('jwt'))
  async deleteOneUserVault(
    @getCurrentUserId() userId: string,
    @Body() deleteVaultData: deleteVaultDto,
  ): Promise<Vault> {
    return await this.vaultService.deleteOneUserVault(userId, deleteVaultData);
  }
}
