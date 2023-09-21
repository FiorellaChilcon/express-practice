import { AppDataSource } from '@/infra/data-source';
import { User } from '@/infra/entity';
import { Repository } from 'typeorm';

export class UserRepository {
  repo: Repository<User>;

  constructor() {
    this.repo = AppDataSource.getRepository(User);
  }

  async create(input: Partial<User>): Promise<User> {
    const user = this.repo.create(input);
    await user.save();
    return user;
  }

  async findAll(): Promise<User[]> {
    const users = await this.repo.find();
    return users;
  }

  async findOneById(id: string): Promise<User | null> {
    const user = await this.repo.findOneBy({ id });
    return user;
  }

  async updateById(id: string, input: Partial<User>): Promise<User | null> {
    const user = await this.repo.findOneBy({ id });
    if (user) {
      user.firstName = input.firstName ?? user.firstName;
      user.lastName = input.lastName ?? user.lastName;
      user.age = input.age ?? user.age;
      await user.save();
    }

    return user;
  }

  async deleteById(id: string): Promise<User | null> {
    const user = await this.repo.findOneBy({ id });
    if (user) {
      await this.repo.delete({ id: user.id });
    }

    return user;
  }
}
