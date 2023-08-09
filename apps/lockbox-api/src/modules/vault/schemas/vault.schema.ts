import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import { CategoryTypes } from '../../../enum/vault.enum';
import { UserFolder } from '../../../modules/user-folder/schemas/user-folder.schema';

@Schema({
  timestamps: true,
})
export class Vault {
  @Prop()
  name: string;

  @Prop()
  link: string;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  note: string;

  @Prop({
    default: CategoryTypes.UNCATEGORIZED,
    type: mongoose.Schema.Types.String,
    enum: CategoryTypes,
  })
  category: CategoryTypes;

  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'UserFolder' }] })
  folder: UserFolder;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}
export type VaultDocument = Vault & Document;

export const VaultSchema = SchemaFactory.createForClass(Vault);
