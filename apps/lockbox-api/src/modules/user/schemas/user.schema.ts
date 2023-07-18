import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Vault } from '../../vault/schemas/vault.schema';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop()
  name: string;

  @Prop({ unique: [true, 'Email address already exists'] })
  email: string;

  @Prop()
  password: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: Vault.name }] })
  vaults: Types.Array<Vault>;
}

export const UserSchema = SchemaFactory.createForClass(User);
