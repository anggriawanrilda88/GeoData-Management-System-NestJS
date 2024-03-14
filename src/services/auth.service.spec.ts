import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn(),
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateToken', () => {
    it('should return decoded payload if token is valid', () => {
      const token = 'valid_token';
      const decoded = { user: 'test_user' };
      jest.spyOn(jwtService, 'verify').mockReturnValue(decoded);

      expect(service.validateToken(token)).toEqual(decoded);
      expect(jwtService.verify).toHaveBeenCalledWith(token);
    });

    it('should throw UnauthorizedException if token is invalid', () => {
      const token = 'invalid_token';
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error();
      });

      expect(() => service.validateToken(token)).toThrow(UnauthorizedException);
      expect(jwtService.verify).toHaveBeenCalledWith(token);
    });
  });

  describe('generateToken', () => {
    it('should return generated token', () => {
      const payload = { user: 'test_user' };
      const token = 'generated_token';
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      expect(service.generateToken(payload)).toEqual(token);
      expect(jwtService.sign).toHaveBeenCalledWith(payload);
    });

    it('should throw UnauthorizedException if token cannot be generated', () => {
      const payload = { user: 'test_user' };
      jest.spyOn(jwtService, 'sign').mockImplementation(() => {
        throw new Error();
      });

      expect(() => service.generateToken(payload)).toThrow(UnauthorizedException);
      expect(jwtService.sign).toHaveBeenCalledWith(payload);
    });
  });
});