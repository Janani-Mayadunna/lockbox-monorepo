import { IsNotEmpty, IsString } from 'class-validator';
// import { ApiProperty } from '@nestjs/swagger';

export class deleteVaultDto {
  //   @ApiProperty()
  @IsNotEmpty({ message: 'The vault should have an id to delete' })
  @IsString()
  id: string;
}
