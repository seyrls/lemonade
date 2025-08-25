import { TransformInterceptor } from '../../../src/core/interceptors/transform.interceptor';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';

class TestDto {
  id!: string;
  name!: string;
  email!: string;

  constructor(partial: Partial<TestDto>) {
    Object.assign(this, partial);
  }
}

describe('TransformInterceptor', () => {
  let interceptor: TransformInterceptor<TestDto>;
  let mockExecutionContext: ExecutionContext;
  let mockCallHandler: CallHandler;

  beforeEach(() => {
    interceptor = new TransformInterceptor(TestDto);

    mockExecutionContext = {
      switchToHttp: jest.fn(),
      getClass: jest.fn(),
      getHandler: jest.fn(),
      getArgs: jest.fn(),
      getType: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getArgByIndex: jest.fn(),
    } as unknown as ExecutionContext;

    mockCallHandler = {
      handle: jest.fn(),
    } as unknown as CallHandler;
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  describe('intercept', () => {
    it('should return an observable', () => {
      const rawData = { id: '123', name: 'Test' };
      (mockCallHandler.handle as jest.Mock).mockReturnValue(of(rawData));

      const result = interceptor.intercept(
        mockExecutionContext,
        mockCallHandler,
      );

      expect(result).toBeDefined();
      expect(typeof result.subscribe).toBe('function');
    });

    it('should call the next handler', () => {
      const rawData = { id: '123', name: 'Test' };
      (mockCallHandler.handle as jest.Mock).mockReturnValue(of(rawData));

      interceptor.intercept(mockExecutionContext, mockCallHandler);

      expect(mockCallHandler.handle).toHaveBeenCalled();
    });

    it('should handle the observable chain', (done) => {
      const rawData = { id: '123', name: 'Test' };
      (mockCallHandler.handle as jest.Mock).mockReturnValue(of(rawData));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (result) => {
          expect(result).toBeDefined();
          done();
        },
        error: done,
      });
    });
  });
});
