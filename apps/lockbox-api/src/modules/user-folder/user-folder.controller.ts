import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserFolderService } from './user-folder.service';
import { AuthGuard } from '@nestjs/passport';
import { ICreateFolderResponse } from './interfaces/user-folder.interfaces';
import { CreateFolderDto } from './dto/create-folder.dto';
import { getCurrentUserId } from '../auth/decorators/currentUserId';

@Controller('user-folder')
export class UserFolderController {
  constructor(private folderService: UserFolderService) {}

  // get all user folders
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAllUserFolders(@getCurrentUserId() userId: string): Promise<any> {
    return await this.folderService.getAllUserFolders(userId);
  }

  // create a folder
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createFolder(
    @Body() folder: CreateFolderDto,
    @getCurrentUserId() userId: string,
  ): Promise<ICreateFolderResponse> {
    return await this.folderService.createFolder(folder, userId);
  }

  // get all vaults in a folder
  //   @Get('/vaults')
  //   @UseGuards(AuthGuard('jwt'))
  //   async getAllVaultsInFolder(@getCurrentUserId() userId: string): Promise<any> {
  //     return await this.folderService.getAllVaultsInFolder(userId);
  //   }
}
