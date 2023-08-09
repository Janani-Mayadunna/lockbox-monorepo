import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Vault } from '../../vault/schemas/vault.schema';
import { SharedVaultDto } from '../dto/shared-vault.dto';
import { UserFolder } from 'src/modules/user-folder/schemas/user-folder.schema';

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

  @Prop({ type: [{ type: Types.ObjectId, ref: 'UserFolder' }] })
  folders: Types.Array<UserFolder>;
}

export const UserSchema = SchemaFactory.createForClass(User);
