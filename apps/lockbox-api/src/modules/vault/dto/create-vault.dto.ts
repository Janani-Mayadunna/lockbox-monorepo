import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateVaultDto {
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
