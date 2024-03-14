import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Users } from '../models/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) { }

  async find(
    limit?: number,
    offset?: number,
    sort?: "ASC" | "DESC",
    sortBy?: string,
    keyword?: string,
  ): Promise<{ count: number, data: any }> {
    const queryBuilder = this.usersRepository.createQueryBuilder('users');

    if (keyword) {
      queryBuilder.orWhere(`users.name ILIKE :keyword`, { keyword: `%${keyword}%` });
      queryBuilder.orWhere(`users.address ILIKE :keyword`, { keyword: `%${keyword}%` });
      queryBuilder.orWhere(`users.email ILIKE :keyword`, { keyword: `%${keyword}%` });
    }

    // get count for pagination
    const count = queryBuilder.getCount();

    if (offset) {
      queryBuilder.offset(Number(offset));
    }

    if (limit) {
      queryBuilder.limit(limit);
    }

    queryBuilder.addOrderBy(sortBy, sort);

    return {
      count: await count,
      data: await queryBuilder.getMany(),
    };
  }

  async findOne(id: number) {
    return this.entityManager.findOne(Users, { where: { id } });
  }

  async findByEmail(email: string) {
    return this.entityManager.findOne(Users, { where: { email } });
  }
}
