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
    console.log('req.user', userId);
    return this.vaultService.createVault(vault, userId);
  }

  //retrieve all vaults in the array and display
  @Get()
  @UseGuards(AuthGuard())
  async getAllUserVaults(@getCurrentUserId() userId: string): Promise<Vault[]> {
    return this.vaultService.getAllUserVaults(userId);
  }
}
