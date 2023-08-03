import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Vault } from '../../vault/schemas/vault.schema';
import { Type } from '@nestjs/common';
import { SharedVaultDto } from '../dto/shared-vault.dto';

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

  @Prop()
  salt: string;

  @Prop()
  publicKey: string;

  @Prop()
  privateKey: Buffer;

  @Prop()
  sharedVault: Array<SharedVaultDto>;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Vault' }] })
  vaults: Types.Array<Vault>;
}

export const UserSchema = SchemaFactory.createForClass(User);
