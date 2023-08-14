import { IsOptional, IsString } from 'class-validator';
import { UserFolder } from '../../../modules/user-folder/schemas/user-folder.schema';

export class UpdateVaultDto {
  @IsOptional()
  @IsString()
  readonly category: string;

  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly folder: UserFolder;

  @IsOptional()
  @IsString()
  readonly link: string;

  @IsOptional()
  @IsString()
  readonly username: string;

  @IsOptional()
  @IsString()
  readonly password: string;

  @IsOptional()
  @IsString()
  readonly note: string;
}
