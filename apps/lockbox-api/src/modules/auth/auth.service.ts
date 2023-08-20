import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../user/schemas/user.schema';
import * as argon2 from 'argon2';
import {
  generateSalt,
  generateUserKeyPair,
} from '../../utils/helper-functions';
import logger from '../../utils/logger';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  //sign up user
  async signUp(signUpDto: SignUpDto): Promise<{ message: string }> {
    let userSalt = '';

    const { name, email, password, salt } = signUpDto;

    const hashedPassword = await argon2.hash(`${email}:${password}`);

    if (salt !== '') {
      userSalt = salt;
    } else {
      userSalt = generateSalt();
    }

    const userECDHKeyPair = generateUserKeyPair();

    await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      publicKey: userECDHKeyPair.userPublicKey,
      privateKey: userECDHKeyPair.userPrivateKey,
      salt: userSalt,
    });

    // const token = this.jwtService.sign({ id: user._id });
    return {
      message: 'signup successful',
    };
  }

  //login user
  async login(
    loginDto: LoginDto,
  ): Promise<{ access_token: string; userId: string }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatched = await argon2.verify(
      user.password,
      `${email}:${password}`,
    );

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ id: user._id });
    logger.info(token);
    return {
      access_token: token,
      userId: user._id,
    };
  }

  //get current user
  async getCurrentUser(token: string): Promise<{ user: Partial<User> }> {
    const { id } = this.jwtService.verify(token);

    const user = await this.userModel.findById(id);

    if (!user) {
      throw new UnauthorizedException('Log in to access this endpoint');
    }

    //send all the values except usr.password
    const filteredUser: Partial<User> = {
      id: user.id,
      email: user.email,
      name: user.name,
      salt: user.salt ? user.salt : '',
      folders: user.folders,
    };
    logger.info('Current user fetched');
    return { user: filteredUser };
  }
}
