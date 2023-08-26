import { mock } from 'node:test';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { faker } from '@faker-js/faker';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: Partial<AuthService>;

  beforeEach(async () => {
    mockAuthService = {
      signUp: jest.fn(),
      login: jest.fn(),
      getCurrentUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('auth controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('auth service should be defined', () => {
    expect(mockAuthService).toBeDefined();
  });

  const userId = faker.database.mongodbObjectId();

  describe('signUp', () => {
    it('should sign up a user', async () => {
      const signUpDto: SignUpDto = {} as SignUpDto;
      const expectedResult = { message: 'signup successful' };

      jest.spyOn(mockAuthService, 'signUp').mockResolvedValue(expectedResult);

      const result = await controller.signUp(signUpDto);

      expect(mockAuthService.signUp).toHaveBeenCalledWith(signUpDto);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const loginDto: LoginDto = {} as LoginDto;
      const expectedResult = {
        access_token: '',
        userId,
      };

      jest.spyOn(mockAuthService, 'login').mockResolvedValue(expectedResult);

      const result = await controller.login(loginDto);

      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('getCurrentUser', () => {
    it('should get current user', async () => {
      const token = faker.string.uuid();
      const expectedResult = { user: {} };

      jest
        .spyOn(mockAuthService, 'getCurrentUser')
        .mockResolvedValue(expectedResult);

      const result = await controller.getCurrentUser(token);

      expect(mockAuthService.getCurrentUser).toHaveBeenCalledWith(token);

      expect(result).toEqual(expectedResult);
    });
  });
});
