import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { UsersService } from './users.service';
import { Users } from '../models/users.entity';
import { equal } from 'assert';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Repository<Users>;
  let usersEntityManager: EntityManager;

  const queryBuilderMock = {
    getCount: jest.fn().mockResolvedValue(1),
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockReturnValue([
      {
        user_id: 1,
        name: "User 1",
        email: "user1@gmail.com",
        address: "Jalan Testing Raya 1",
        created_at: "2024-03-13T00:20:35.543Z",
        updated_at: "2024-03-13T00:20:35.543Z"
      }
    ]),
  };

  const usersRepositoryMock = {
    createQueryBuilder: jest.fn(() => queryBuilderMock),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useValue: usersRepositoryMock,
        },
        {
          provide: EntityManager,
          useValue: {
            findOne: jest.fn().mockReturnValue({
              user_id: 1,
              name: "User 1",
              email: "user1@gmail.com",
              address: "Jalan Testing Raya 1",
              created_at: "2024-03-13T00:20:35.543Z",
              updated_at: "2024-03-13T00:20:35.543Z"
            }),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
    usersEntityManager = module.get<EntityManager>(EntityManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Get list user data', () => {
    it('should return users data', async () => {
      const expectedData = {
        count: 1,
        data: [
          {
            user_id: 1,
            name: "User 1",
            email: "user1@gmail.com",
            address: "Jalan Testing Raya 1",
            created_at: "2024-03-13T00:20:35.543Z",
            updated_at: "2024-03-13T00:20:35.543Z"
          }
        ],
      };

      const result = await service.find();
      expect(result).toEqual(expectedData);
    });
  });

  describe('Get detail user data', () => {
    it('should return user data', async () => {
      const expectedData = {
        user_id: 1,
        name: "User 1",
        email: "user1@gmail.com",
        address: "Jalan Testing Raya 1",
        created_at: "2024-03-13T00:20:35.543Z",
        updated_at: "2024-03-13T00:20:35.543Z"
      };

      const result = await service.findOne(1);
      expect(result).toEqual(expectedData);
    });
  });

  describe('Get detail user by email', () => {
    it('should return user by email', async () => {
      const expectedData = {
        user_id: 1,
        name: "User 1",
        email: "user1@gmail.com",
        address: "Jalan Testing Raya 1",
        created_at: "2024-03-13T00:20:35.543Z",
        updated_at: "2024-03-13T00:20:35.543Z"
      };

      const result = await service.findByEmail("test@gmail.com");
      expect(result).toEqual(expectedData);
    });
  });

  // describe('Create list user data', () => {
  //   it('should return users success create', async () => {
  //     const result = await service.saveMultipleData([
  //       {
  //         "type": "Feature",
  //         "geometry": {
  //           "type": "Point",
  //           "coordinates": [
  //             125.6,
  //             10.1
  //           ]
  //         },
  //         "properties": {
  //           "name": "Dinagat Islands"
  //         }
  //       }
  //     ]);
  //   });
  //   it('should return users error create', async () => {
  //     try {
  //       jest.spyOn(usersEntityManager, 'save').mockRejectedValue(new Error('Failed to getCount'));
  //       const result = await service.saveMultipleData([
  //         {
  //           "type": "Feature",
  //           "geometry": {
  //             "type": "Point",
  //             "coordinates": [
  //               125.6,
  //               10.1
  //             ]
  //           },
  //           "properties": {
  //             "name": "Dinagat Islands"
  //           }
  //         }
  //       ]);
  //     } catch (error) {
  //       equal(error.message, "Error saving GeoJSON data to database.");
  //     }
  //   });
  // });
});