import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../../services/users.service';
import { Users } from '../../models/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { AuthService } from '../../services/auth.service';
import { RolesService } from '../../services/roles.service';
import { equal } from 'assert';

describe('UsersController', () => {
  let controller: UsersController;
  const mockUserService = {
    findByEmail: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockAuthService = {
    validateToken: jest.fn(),
    generateToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUserService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: RolesService,
          useValue: {
            getRoles: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Login user', () => {
    it('should get token after login', async () => {
      jest.spyOn(mockUserService, 'findByEmail').mockResolvedValue({
        user_id: 1,
        name: "User 1",
        email: "test1@gmail.com",
        password: "123456",
        address: "Jalan Testing Raya 1",
        created_at: "2024-03-13T00:20:35.543Z",
        updated_at: "2024-03-13T00:20:35.543Z"
      });

      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQWRtaW4gM";
      jest.spyOn(mockAuthService, 'generateToken').mockResolvedValue(token);

      const body: LoginUserDto = {
        email: "test1@gmail.com",
        password: "123456",
      };

      const data = await controller.login(body);
      expect(await data.data.token).toEqual(token);
    });

    it('should get error user not found', async () => {
      try {
        jest.spyOn(mockUserService, 'findByEmail').mockResolvedValue(null);
        const body: LoginUserDto = {
          email: "test1@gmail.com",
          password: "123456",
        };

        await controller.login(body);
      } catch (error) {
        equal(error.message, "User not found.");
      }
    });

    it('should get error user not found', async () => {
      try {
        jest.spyOn(mockUserService, 'findByEmail').mockResolvedValue({
          user_id: 1,
          name: "User 1",
          email: "test1@gmail.com",
          password: "123453",
          address: "Jalan Testing Raya 1",
          created_at: "2024-03-13T00:20:35.543Z",
          updated_at: "2024-03-13T00:20:35.543Z"
        });

        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQWRtaW4gM";
        jest.spyOn(mockAuthService, 'generateToken').mockResolvedValue(token);

        const body: LoginUserDto = {
          email: "test1@gmail.com",
          password: "123456",
        };

        await controller.login(body);
      } catch (error) {
        equal(error.message, "Wrong password, try again.");
      }
    });
  })


  it('should show list users', async () => {
    const findUserDto = {
      limit: 1,
      keyword: "",
      offset: 0,
      order_by: "name",
      sort_by: "asc"
    } as FindUserDto;

    const listUser = {
      count: 1,
      data: [
        {
          "id": 2,
          "name": "Admin 1",
          "email": "admin1@gmail.com",
          "address": "Jalan Testing Raya 2",
          "created_at": "2024-03-13T00:21:24.300Z",
          "updated_at": "2024-03-13T00:21:24.300Z"
        } as any
      ]
    };

    const expectData = {
      count: 1,
      data: [
        {
          "user_id": 2,
          "name": "Admin 1",
          "email": "admin1@gmail.com",
          "address": "Jalan Testing Raya 2",
          "created_at": "2024-03-13T00:21:24.300Z",
          "updated_at": "2024-03-13T00:21:24.300Z"
        } as any
      ]
    };

    jest.spyOn(mockUserService, 'find').mockReturnValue(listUser);

    const result = await controller.find(findUserDto);
    expect(expectData).toEqual(result);
  });

  it('should show detail user', async () => {
    const detailUser = {
      "id": 2,
      "name": "Admin 1",
      "email": "admin1@gmail.com",
      "address": "Jalan Testing Raya 2",
      "created_at": "2024-03-13T00:21:24.300Z",
      "updated_at": "2024-03-13T00:21:24.300Z"
    };

    const expectData = {
      data: {
        "user_id": 2,
        "name": "Admin 1",
        "email": "admin1@gmail.com",
        "address": "Jalan Testing Raya 2",
        "created_at": "2024-03-13T00:21:24.300Z",
        "updated_at": "2024-03-13T00:21:24.300Z"
      }
    } as any;

    jest.spyOn(mockUserService, 'findOne').mockReturnValue(detailUser);

    const result = await controller.findOne("1");
    expect(expectData).toEqual(expectData);
  });

  it('should show error detail user', async () => {
    try {
      jest.spyOn(mockUserService, 'findOne').mockResolvedValue(null);
      await controller.findOne("1");
    } catch (error) {
      equal(error.message, "User not found.");
    }
  });
});