import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../../../src/customer/orders/services/user.service';
import { UsersRepository } from '../../../../../src/customer/orders/repositories/users.repository';
import { NotFoundException } from '@nestjs/common';
import { User } from '../../../../../src/entities/user.entity';

describe('UserService', () => {
  let service: UserService;
  let mockUsersRepository: jest.Mocked<UsersRepository>;

  beforeEach(async () => {
    const mockRepository = {
      findUserById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UsersRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    mockUsersRepository = module.get(UsersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserById', () => {
    it('should return a user when found', async () => {
      const mockUser = {
        id: 'user-uuid',
        name: 'John Doe',
        email: 'john@example.com',
        phone_number: '+1234567890',
      } as User;

      mockUsersRepository.findUserById.mockResolvedValue(mockUser);

      const result = await service.getUserById('user-uuid');

      expect(result).toEqual(mockUser);
      expect(mockUsersRepository.findUserById).toHaveBeenCalledWith(
        'user-uuid',
      );
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUsersRepository.findUserById.mockResolvedValue(null);

      await expect(service.getUserById('non-existent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.getUserById('non-existent')).rejects.toThrow(
        'User Id non-existent wasnot found',
      );
      expect(mockUsersRepository.findUserById).toHaveBeenCalledWith(
        'non-existent',
      );
    });

    it('should call repository with correct user ID', async () => {
      const mockUser = {
        id: 'test-uuid',
        name: 'Test User',
        email: 'test@example.com',
        phone_number: '+1234567890',
      } as User;

      mockUsersRepository.findUserById.mockResolvedValue(mockUser);

      await service.getUserById('test-uuid');

      expect(mockUsersRepository.findUserById).toHaveBeenCalledWith(
        'test-uuid',
      );
      expect(mockUsersRepository.findUserById).toHaveBeenCalledTimes(1);
    });

    it('should handle user with minimal data', async () => {
      const mockUser = {
        id: 'minimal-uuid',
        name: 'Minimal User',
        email: 'minimal@example.com',
        phone_number: '+1234567890',
      } as User;

      mockUsersRepository.findUserById.mockResolvedValue(mockUser);

      const result = await service.getUserById('minimal-uuid');

      expect(result.id).toBe('minimal-uuid');
      expect(result.name).toBe('Minimal User');
      expect(result.email).toBe('minimal@example.com');
      expect(result.phone_number).toBe('+1234567890');
    });
  });
});
