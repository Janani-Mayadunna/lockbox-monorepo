import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFolderDto {
  @IsNotEmpty()
  @IsString()
  folderName: string;
}
