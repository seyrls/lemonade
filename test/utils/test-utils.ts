import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

export const createMockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  count: jest.fn(),
  findAndCount: jest.fn(),
});

export const createRepositoryMock = (entity: any) => ({
  provide: getRepositoryToken(entity),
  useValue: createMockRepository(),
});

export const createTestingModule = async (
  imports: any[],
  providers: any[] = [],
) => {
  return Test.createTestingModule({
    imports,
    providers,
  }).compile();
};
