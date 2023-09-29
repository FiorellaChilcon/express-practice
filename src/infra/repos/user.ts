import { User } from '@/infra/entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { PgManager } from '@/infra/database';

export class UserRepository {
  repo: Repository<User>;

  /**
   * @description Initialize user repository
   * @param manager To use this repository with transactions,
   * pass your PgManager instance so operations are called from the same query runner
   */
  constructor(manager?: PgManager) {
    this.repo = manager ? manager.getRepository(User) : new PgManager().getRepository(User);
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

  async findOneByEmailOrUsername(userId: string): Promise<User | null> {
    const user = await this.repo
      .createQueryBuilder('user')
      .where('user.email = :email', { email: userId })
      .orWhere('user.username = :username', { username: userId })
      .getOne();

    return user;
  }

  async findOne(query: FindOptionsWhere<User>): Promise<User | null> {
    const user = await this.repo.findOne({ where: query });
    return user;
  }

  async updateById(id: string, input: Partial<User>): Promise<User | null> {
    const user = await this.repo.findOneBy({ id });
    if (user) {
      user.firstName = input.firstName ?? user.firstName;
      user.lastName = input.lastName ?? user.lastName;
      user.username = input.username ?? user.username;
      user.email = input.email ?? user.email;
      user.password = input.password ?? user.password;
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
