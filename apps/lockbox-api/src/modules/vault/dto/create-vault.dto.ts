import { IsNotEmpty, IsString } from 'class-validator';

export class CreateVaultDto {
  @IsNotEmpty()
  @IsString()
  link: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
