import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../../user/schemas/user.schema';

@Schema({
  timestamps: true,
})
export class Vault {
  //   @Prop()
  //   category: string;

  @Prop()
  link: string;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  note: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}
export type VaultDocument = Vault & Document;

export const VaultSchema = SchemaFactory.createForClass(Vault);
