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

@Controller('vault')
export class VaultController {
  constructor(private vaultService: VaultService) {}

  //create a 1 vault in the vaults array of user
  @Post()
  @UseGuards(AuthGuard())
  async createVault(
    @Body() vault: CreateVaultDto,
    @getCurrentUserId() userId: string,
  ): Promise<Vault> {
    // vault.user = userId;
    console.log('req.user', userId);
    return this.vaultService.createVault(vault, userId);
  }

  //retrieve all vaults in the array and display
  @Get()
  @UseGuards(AuthGuard())
  async getAllUserVaults(@getCurrentUserId() userId: string): Promise<Vault[]> {
    return this.vaultService.getAllUserVaults(userId);
  }

  //retrieve a single vault in the array and display
  @Get(':id')
  @UseGuards(AuthGuard())
  async getOneUserVault(
    @getCurrentUserId() userId: string,
    @Param('id') vaultId: string,
  ): Promise<Vault> {
    return this.vaultService.getOneUserVault(userId, vaultId);
  }

  //update a single vault in the array and display
  @Put(':id')
  @UseGuards(AuthGuard())
  async updateOneUserVault(
    @getCurrentUserId() userId: string,
    @Param('id') vaultId: string,
    @Body() UpdateVaultData: UpdateVaultDto,
  ): Promise<Vault> {
    return this.vaultService.updateOneUserVault(
      userId,
      vaultId,
      UpdateVaultData,
    );
  }

  //delete a single vault in the array and display
  @Delete('/delete')
  @UseGuards(AuthGuard())
  async deleteOneUserVault(
    @getCurrentUserId() userId: string,
    @Body() deleteVaultData: deleteVaultDto,
  ): Promise<Vault> {
    return this.vaultService.deleteOneUserVault(userId, deleteVaultData);
  }
}
