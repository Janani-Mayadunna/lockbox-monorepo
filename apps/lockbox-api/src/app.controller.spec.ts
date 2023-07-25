import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;
  let mockAppService: AppService;

  beforeEach(async () => {
    mockAppService = {
      getHello: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('app controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('app service should be defined', () => {
    expect(mockAppService).toBeDefined();
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      const expectedValue = 'Hello World!';
      jest.spyOn(mockAppService, 'getHello').mockReturnValue(expectedValue);

      const result = controller.getHello();

      expect(mockAppService.getHello).toHaveBeenCalled();
      expect(result).toEqual(expectedValue);
    });
  });
});
