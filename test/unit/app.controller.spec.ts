import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../../src/app.controller';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHealth', () => {
    it('should return health status object', () => {
      const result = controller.getHealth();

      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('timestamp');
      expect(result.status).toBe('ok');
      expect(typeof result.timestamp).toBe('string');
    });

    it('should return status as "ok"', () => {
      const result = controller.getHealth();
      expect(result.status).toBe('ok');
    });

    it('should return timestamp as ISO string', () => {
      const result = controller.getHealth();
      const timestamp = new Date(result.timestamp);

      expect(timestamp.getTime()).not.toBeNaN();
      expect(result.timestamp).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      );
    });

    it('should return current timestamp', () => {
      const beforeCall = new Date();
      const result = controller.getHealth();
      const afterCall = new Date();
      const resultTimestamp = new Date(result.timestamp);

      expect(resultTimestamp.getTime()).toBeGreaterThanOrEqual(
        beforeCall.getTime(),
      );
      expect(resultTimestamp.getTime()).toBeLessThanOrEqual(
        afterCall.getTime(),
      );
    });
  });
});
