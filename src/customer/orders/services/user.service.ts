import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../../../entities/user.entity';
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
export class UserService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findUserById(id);

    if (!user) {
      throw new NotFoundException(`User Id ${id} wasnot found`);
    }

    return user;
  }
}
