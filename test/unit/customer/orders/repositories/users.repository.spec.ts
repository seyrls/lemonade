import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from '../../../../../src/customer/orders/repositories/users.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../../../src/entities/user.entity';
import { Repository } from 'typeorm';

describe('UsersRepository', () => {
  let repository: UsersRepository;
  let mockUserRepository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const mockRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    repository = module.get<UsersRepository>(UsersRepository);
    mockUserRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findUserById', () => {
    it('should return a user when found', async () => {
      const mockUser = {
        id: 'user-uuid',
        name: 'John Doe',
        email: 'john@example.com',
        phone_number: '+1234567890',
      } as User;

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await repository.findUserById('user-uuid');

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'user-uuid' },
        select: ['id', 'name', 'email', 'phone_number'],
      });
    });

    it('should return null when user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await repository.findUserById('non-existent');

      expect(result).toBeNull();
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'non-existent' },
        select: ['id', 'name', 'email', 'phone_number'],
      });
    });

    it('should call repository with correct parameters', async () => {
      const mockUser = {
        id: 'test-uuid',
        name: 'Test User',
        email: 'test@example.com',
        phone_number: '+1234567890',
      } as User;

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await repository.findUserById('test-uuid');

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-uuid' },
        select: ['id', 'name', 'email', 'phone_number'],
      });
      expect(mockUserRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should handle user with minimal data', async () => {
      const mockUser = {
        id: 'minimal-uuid',
        name: 'Minimal User',
        email: 'minimal@example.com',
        phone_number: '+1234567890',
      } as User;

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await repository.findUserById('minimal-uuid');

      expect(result).not.toBeNull();
      if (result) {
        expect(result.id).toBe('minimal-uuid');
        expect(result.name).toBe('Minimal User');
        expect(result.email).toBe('minimal@example.com');
        expect(result.phone_number).toBe('+1234567890');
      }
    });

    it('should handle different user IDs', async () => {
      const mockUser1 = {
        id: 'user-1',
        name: 'User One',
        email: 'user1@example.com',
        phone_number: '+1111111111',
      } as User;

      const mockUser2 = {
        id: 'user-2',
        name: 'User Two',
        email: 'user2@example.com',
        phone_number: '+2222222222',
      } as User;

      mockUserRepository.findOne
        .mockResolvedValueOnce(mockUser1)
        .mockResolvedValueOnce(mockUser2);

      const result1 = await repository.findUserById('user-1');
      const result2 = await repository.findUserById('user-2');

      expect(result1).toEqual(mockUser1);
      expect(result2).toEqual(mockUser2);
      expect(mockUserRepository.findOne).toHaveBeenCalledTimes(2);
    });
  });
});
