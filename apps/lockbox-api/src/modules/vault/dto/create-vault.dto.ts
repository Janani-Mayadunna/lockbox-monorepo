import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
// import { User } from '../../user/schemas/user.schema';

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

  // @IsOptional({ message: 'You cannot pass user id' })
  // user: string;
}
