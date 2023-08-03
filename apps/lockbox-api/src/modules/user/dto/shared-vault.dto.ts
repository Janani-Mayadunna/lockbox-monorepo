import { IsNotEmpty, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';

export class SharedVaultDto {
  @IsNotEmpty()
  @IsString()
  readonly vaultId: ObjectId;

  @IsNotEmpty()
  @IsString()
  readonly vaultUsername: string;

  @IsNotEmpty()
  @IsString()
  readonly vaultPassword: string;

  @IsNotEmpty()
  @IsString()
  readonly sharedUserEmail: string;

  @IsNotEmpty()
  @IsString()
  readonly sharedUserName: string;
}
