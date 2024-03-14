import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../services/auth.service';
import { RolesService } from '../../src/services/roles.service';
import { ExecutionContext, UnauthorizedException, ForbiddenException, BadRequestException } from '@nestjs/common';

describe('AuthGuard', () => {
    let guard: AuthGuard;

    const mockAuthService = {
        validateToken: jest.fn(),
    };

    const mockRolesService = {
        getRoles: jest.fn(),
    };

    const mockReflector = {
        get: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthGuard,
                { provide: AuthService, useValue: mockAuthService },
                { provide: RolesService, useValue: mockRolesService },
                { provide: Reflector, useValue: mockReflector },
            ],
        }).compile();

        guard = module.get<AuthGuard>(AuthGuard);
    });

    it('should be defined', () => {
        expect(guard).toBeDefined();
    });

    it('should return true if label matched', () => {
        const context = {
            switchToHttp: () => ({
                getRequest: () => ({
                    headers: { authorization: 'Bearer token' },
                }),
            }),
            getHandler: () => null,
        } as ExecutionContext;

        mockAuthService.validateToken.mockReturnValueOnce({ role: 'user' });
        mockRolesService.getRoles.mockReturnValueOnce({ user: ['user.detail'] });
        mockReflector.get.mockReturnValueOnce(['user.detail']);

        expect(guard.canActivate(context)).toBe(true);
    });

    it('should throw BadRequestException if any error occurs', () => {
        const context = {
            switchToHttp: () => ({
                getRequest: () => ({
                    headers: { authorization: 'Bearer token' },
                }),
            }),
            getHandler: () => null,
        } as ExecutionContext;

        mockAuthService.validateToken.mockImplementationOnce(() => {
            throw new Error('Token validation error');
        });

        expect(() => guard.canActivate(context)).toThrowError(BadRequestException);
    });
});
