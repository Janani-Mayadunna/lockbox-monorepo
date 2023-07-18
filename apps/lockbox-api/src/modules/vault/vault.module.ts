import { Module, forwardRef } from '@nestjs/common';
import { VaultController } from './vault.controller';
import { VaultService } from './vault.service';
import { MongooseModule } from '@nestjs/mongoose';
import { VaultSchema } from './schemas/vault.schema';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { UserSchema } from '../user/schemas/user.schema';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Vault', schema: VaultSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    forwardRef(() => AuthModule),
  ],
  controllers: [VaultController],
  providers: [VaultService],
})
export class VaultModule {}
