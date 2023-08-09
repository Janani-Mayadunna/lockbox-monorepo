import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
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
import { ICreateSharedVault } from '../user/user.interfaces';

@Controller('vault')
export class VaultController {
  constructor(private vaultService: VaultService) {}

  //retrieve all vaults in the vaults array of user and display
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAllUserVaults(
    @Query('category') category: string,
    @Query('folder') folder: string,
    @Query('name') name: string,
    @Query('username') username: string,
    @getCurrentUserId() userId: string,
  ): Promise<Vault[]> {
    const where: any = {};
    if (category) where.category = new RegExp(category.toString(), 'i');
    if (folder) where.folder = new RegExp(folder.toString(), 'i');
    if (name) where.name = new RegExp(name.toString(), 'i');
    if (username) where.username = new RegExp(username.toString(), 'i');

    const options = where;
    return await this.vaultService.getAllUserVaults(userId, options);
  }

  //verify password share link validity and expiration
  @Get('/verify-link/:id')
  async getSharedLink(@Param('id') shareToken: string): Promise<any> {
    return await this.vaultService.verifyShareLink(shareToken);
  }

  //retrieve a single vault in the array and display
  @Get('/vaults/:id')
  @UseGuards(AuthGuard('jwt'))
  async getOneUserVault(
    @getCurrentUserId() userId: string,
    @Param('id') vaultId: string,
  ): Promise<Vault> {
    return await this.vaultService.getOneUserVault(userId, vaultId);
  }

  @Get('/received-vaults')
  @UseGuards(AuthGuard('jwt'))
  async getReceivedVaults(@getCurrentUserId() userId: string): Promise<any> {
    return await this.vaultService.getReceivedVaults(userId);
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

  @Post('/direct-share')
  @UseGuards(AuthGuard('jwt'))
  async directShareVault(
    @Body() createSharedVaultData: ICreateSharedVault,
    @getCurrentUserId() userId: string,
  ): Promise<any> {
    return await this.vaultService.directShareVaultPassword(
      createSharedVaultData,
      userId,
    );
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

  @Delete('/delete-received')
  @UseGuards(AuthGuard('jwt'))
  async deleteOneReceivedVault(
    @getCurrentUserId() userId: string,
    @Body() deleteVaultData: deleteVaultDto,
  ) {
    return await this.vaultService.deleteOneReceivedVault(
      userId,
      deleteVaultData,
    );
  }
}
