import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';
import { User } from '../../user/schemas/user.schema';

export class CreateVaultDto {
  @IsNotEmpty()
  @IsString()
  readonly link: string;

  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @IsEmpty({ message: 'You cannot pass user id' })
  readonly user: User;
}
