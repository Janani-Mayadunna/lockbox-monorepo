import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { VaultModule } from './modules/vault/vault.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '../..', 'lockbox-frontend', 'dist'),
    // }),

    AuthModule,
    UserModule,
    VaultModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
