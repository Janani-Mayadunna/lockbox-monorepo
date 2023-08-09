import { Module } from '@nestjs/common';
import { UserFolderController } from './user-folder.controller';
import { UserFolderService } from './user-folder.service';
import { MongooseModule } from '@nestjs/mongoose';
import { VaultSchema } from '../vault/schemas/vault.schema';
import { UserSchema } from '../user/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { UserFolderSchema } from './schemas/user-folder.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'UserFolder', schema: UserFolderSchema },
    ]),
    MongooseModule.forFeature([{ name: 'Vault', schema: VaultSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [UserFolderController],
  providers: [UserFolderService, JwtService],
  exports: [UserFolderService],
})
export class UserFolderModule {}
