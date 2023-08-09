import { Module, forwardRef } from '@nestjs/common';
import { VaultController } from './vault.controller';
import { VaultService } from './vault.service';
import { MongooseModule } from '@nestjs/mongoose';
import { VaultSchema } from './schemas/vault.schema';
import { AuthModule } from '../auth/auth.module';
import { UserSchema } from '../user/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserFolderSchema } from '../user-folder/schemas/user-folder.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Vault', schema: VaultSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: 'UserFolder', schema: UserFolderSchema },
    ]),
  ],
  controllers: [VaultController],
  providers: [VaultService, JwtService],
  exports: [VaultService],
})
export class VaultModule {}
