import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { UserFolderController } from './user-folder.controller';
import { UserFolderService } from './user-folder.service';
import {
  ICreateFolder,
  ICreateFolderResponse,
} from './interfaces/user-folder.interfaces';
import { faker } from '@faker-js/faker';

describe('UserFolderController', () => {
  let controller: UserFolderController;
  let mockUserFolderService: Partial<UserFolderService>;

  beforeEach(async () => {
    mockUserFolderService = {
      createFolder: jest.fn(),
      getAllUserFolders: jest.fn(),
      getFolderById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserFolderController],
      providers: [
        {
          provide: UserFolderService,
          useValue: mockUserFolderService,
        },
      ],
    }).compile();

    controller = module.get<UserFolderController>(UserFolderController);
  });

  it('user folder controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('user folder service should be defined', () => {
    expect(mockUserFolderService).toBeDefined();
  });

  const userId = faker.database.mongodbObjectId();

  describe('createFolder', () => {
    it('should create a folder', async () => {
      const folder: ICreateFolder = {} as ICreateFolder;
      const expectedResult: ICreateFolderResponse = {} as ICreateFolderResponse;

      jest
        .spyOn(mockUserFolderService, 'createFolder')
        .mockResolvedValue(expectedResult);

      const result = await controller.createFolder(folder, userId);

      expect(mockUserFolderService.createFolder).toHaveBeenCalledWith(
        folder,
        userId,
      );

      expect(result).toEqual(expectedResult);
    });

    describe('getAllUserFolders', () => {
      it('should get all user folders', async () => {
        const expectedResult: any = {};

        jest
          .spyOn(mockUserFolderService, 'getAllUserFolders')
          .mockResolvedValue(expectedResult);

        const result = await controller.getAllUserFolders(userId);

        expect(mockUserFolderService.getAllUserFolders).toHaveBeenCalledWith(
          userId,
        );

        expect(result).toEqual(expectedResult);
      });
    });

    describe('getFolderById', () => {
      it('should get a folder by id', async () => {
        const folderId = faker.database.mongodbObjectId();
        const expectedResult: any = {};

        jest
          .spyOn(mockUserFolderService, 'getFolderById')
          .mockResolvedValue(expectedResult);

        const result = await controller.getFolderById(userId, folderId);

        expect(mockUserFolderService.getFolderById).toHaveBeenCalledWith(
          folderId,
        );

        expect(result).toEqual(expectedResult);
      });
    });
  });
});
