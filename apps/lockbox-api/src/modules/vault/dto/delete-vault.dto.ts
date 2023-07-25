import { IsNotEmpty, IsString } from 'class-validator';

export class deleteVaultDto {
  @IsNotEmpty({ message: 'The vault should have an id to delete' })
  @IsString()
  id: string;
}
