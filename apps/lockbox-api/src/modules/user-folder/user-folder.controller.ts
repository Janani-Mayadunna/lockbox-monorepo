import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
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

  // get folder by id
  @Get('/:id')
  @UseGuards(AuthGuard('jwt'))
  async getFolderById(
    @getCurrentUserId() userId: string,
    @Param('id') folderId: string,
  ): Promise<any> {
    return await this.folderService.getFolderById(folderId);
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
}
