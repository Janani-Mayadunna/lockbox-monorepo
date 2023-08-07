import { IsOptional, IsString } from 'class-validator';

export class UpdateVaultDto {
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
