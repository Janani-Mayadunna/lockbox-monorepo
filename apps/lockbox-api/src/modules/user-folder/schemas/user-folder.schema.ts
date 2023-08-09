import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Vault } from '../../../modules/vault/schemas/vault.schema';
import { User } from '../../../modules/user/schemas/user.schema';

@Schema({
  timestamps: true,
})
export class UserFolder {
  @Prop({ unique: [true, 'Folder with this name already exists'] })
  folderName: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'Vault' }] })
  vaults: mongoose.Types.Array<Vault>;
}

export const UserFolderSchema = SchemaFactory.createForClass(UserFolder);
