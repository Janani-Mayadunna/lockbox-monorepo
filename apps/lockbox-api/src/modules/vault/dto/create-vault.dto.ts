import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CategoryTypes } from '../../../enum/vault.enum';
import { UserFolder } from '../../../modules/user-folder/schemas/user-folder.schema';

export class CreateVaultDto {
  @IsOptional()
  @IsString()
  category: CategoryTypes;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  folder: UserFolder;

  @IsOptional()
  @IsString()
  link: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  note: string;
}
