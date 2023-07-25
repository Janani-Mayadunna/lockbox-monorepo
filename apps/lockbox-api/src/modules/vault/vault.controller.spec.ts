import { Test, TestingModule } from '@nestjs/testing';
import { VaultController } from './vault.controller';
import { VaultService } from './vault.service';
import { AuthService } from '../auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { CreateVaultDto } from './dto/create-vault.dto';
import { faker } from '@faker-js/faker';
import { ICreateVaultResponse } from './interfaces/vault.interfaces';
import { Vault } from './schemas/vault.schema';
import { UpdateVaultDto } from './dto/update-vault.dto';
import { deleteVaultDto } from './dto/delete-vault.dto';

describe('VaultController', () => {
  let controller: VaultController;
  let mockVaultService: Partial<VaultService>;
  let mockAuthService: Partial<AuthService>;
  let mockPassportModule: Partial<PassportModule>;

  beforeEach(async () => {
    mockVaultService = {
      createVault: jest.fn(),
      getAllUserVaults: jest.fn(),
      getOneUserVault: jest.fn(),
      updateOneUserVault: jest.fn(),
      deleteOneUserVault: jest.fn(),
      shareVaultPassword: jest.fn(),
      verifyShareLink: jest.fn(),
    };

    mockAuthService = {};

    mockPassportModule = {};

    const module: TestingModule = await Test.createTestingModule({
      controllers: [VaultController],
      providers: [
        {
          provide: VaultService,
          useValue: mockVaultService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: PassportModule,
          useValue: mockPassportModule,
        },
      ],
    }).compile();

    controller = module.get<VaultController>(VaultController);
  });

  it('vault controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('vault service should be defined', () => {
    expect(mockVaultService).toBeDefined();
  });

  const userId: string = faker.database.mongodbObjectId();

  describe('createVault', () => {
    it('should create a vault', async () => {
      const vault: CreateVaultDto = {
        link: faker.internet.url(),
        username: faker.internet.userName(),
        password: faker.internet.password(),
      };

      const expectedResult: ICreateVaultResponse = {} as ICreateVaultResponse;

      jest
        .spyOn(mockVaultService, 'createVault')
        .mockResolvedValue(expectedResult);

      const result = await controller.createVault(vault, userId);

      expect(mockVaultService.createVault).toHaveBeenCalledWith(vault, userId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getAllUserVaults', () => {
    it('should get all user vaults', async () => {
      const expectedResult: Vault[] = [] as Vault[];

      jest
        .spyOn(mockVaultService, 'getAllUserVaults')
        .mockResolvedValue(expectedResult);

      const result = await controller.getAllUserVaults(userId);

      expect(mockVaultService.getAllUserVaults).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getSharedVault', () => {
    it('should get the link for shared vault', async () => {
      const encryptedPassword: string = faker.internet.password();
      const expectedResult: string = faker.internet.url();

      jest
        .spyOn(mockVaultService, 'shareVaultPassword')
        .mockResolvedValue(expectedResult);

      const result = await controller.getSharedVault(encryptedPassword);

      expect(mockVaultService.shareVaultPassword).toHaveBeenCalledWith(
        encryptedPassword,
      );

      expect(result).toEqual(expectedResult);
    });
  });

  describe('getSharedLink', () => {
    it('should verify the shared link', async () => {
      const shareToken: string = faker.string.uuid();
      const expectedResult: any = {};

      jest
        .spyOn(mockVaultService, 'verifyShareLink')
        .mockResolvedValue(expectedResult);

      const result = await controller.getSharedLink(shareToken);

      expect(mockVaultService.verifyShareLink).toHaveBeenCalledWith(shareToken);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getOneUserVault', () => {
    it('should get one user vault', async () => {
      const vaultId: string = faker.database.mongodbObjectId();
      const expectedResult: Vault = {} as Vault;

      jest
        .spyOn(mockVaultService, 'getOneUserVault')
        .mockResolvedValue(expectedResult);

      const result = await controller.getOneUserVault(userId, vaultId);

      expect(mockVaultService.getOneUserVault).toHaveBeenCalledWith(
        userId,
        vaultId,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateOneUserVault', () => {
    it('should update one user vault', async () => {
      const vaultId: string = faker.database.mongodbObjectId();
      const UpdateVaultData: UpdateVaultDto = {} as UpdateVaultDto;
      const expectedResult: Vault = {} as Vault;

      jest
        .spyOn(mockVaultService, 'updateOneUserVault')
        .mockResolvedValue(expectedResult);

      const result = await controller.updateOneUserVault(
        userId,
        vaultId,
        UpdateVaultData,
      );

      expect(mockVaultService.updateOneUserVault).toHaveBeenCalledWith(
        userId,
        vaultId,
        UpdateVaultData,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('deleteOneUserVault', () => {
    it('should delete one user vault', async () => {
      const deleteVaultData: deleteVaultDto = {} as deleteVaultDto;
      const expectedResult: Vault = {} as Vault;

      jest
        .spyOn(mockVaultService, 'deleteOneUserVault')
        .mockResolvedValue(expectedResult);

      const result = await controller.deleteOneUserVault(
        userId,
        deleteVaultData,
      );

      expect(mockVaultService.deleteOneUserVault).toHaveBeenCalledWith(
        userId,
        deleteVaultData,
      );
      expect(result).toEqual(expectedResult);
    });
  });
});
