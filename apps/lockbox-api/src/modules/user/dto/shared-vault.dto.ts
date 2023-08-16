import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';

export class SharedVaultDto {
  @IsNotEmpty()
  @IsString()
  readonly vaultId: ObjectId;

  @IsOptional()
  @IsString()
  readonly vaultLink?: string;

  @IsNotEmpty()
  @IsString()
  readonly vaultUsername: string;

  @IsNotEmpty()
  @IsString()
  readonly vaultPassword: string;

  @IsNotEmpty()
  @IsString()
  readonly vaultAlias: string;

  @IsNotEmpty()
  @IsString()
  readonly sharedUserEmail: string;

  @IsNotEmpty()
  @IsString()
  readonly sharedUserName: string;

  @IsNotEmpty()
  @IsString()
  readonly isAllowedToSave: boolean;
}
