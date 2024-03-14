import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../services/auth.service';
import { RolesService } from 'src/services/roles.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector, 
        private readonly authService: AuthService,
        private readonly rolesService: RolesService
        ) { }

    canActivate(context: ExecutionContext): boolean {
        try {
            // get metadata label
            const label = this.reflector.get<string[]>('label', context.getHandler());

            const request = context.switchToHttp().getRequest();
            const { authorization }: any = request.headers;
            if (!authorization || authorization.trim() === '') {
                throw new UnauthorizedException('Please provide token');
            }

            const authToken = authorization.replace(/bearer/gim, '').trim();
            const decoded = this.authService.validateToken(authToken);
            const roles = this.rolesService.getRoles();

            // match role api data with label 
            const allowedLabels = roles[decoded.role];
            const isLabelMatch = label.some((data) => allowedLabels.includes(data));

            if (isLabelMatch) {
                return true;
            } else {
                throw new ForbiddenException('Forbidden access');
            }
        } catch (error) {
            throw new BadRequestException(error.message || 'session expired! Please sign In');
        }
    }
}