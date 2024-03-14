import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesService {
    constructor() { }

    getRoles(): any {
        const Roles = {
            "user": ['user.detail', 'geo-locations.list'],
            "admin": ['user.list', 'user.detail', 'geo-locations.create', 'geo-locations.list']
        }
        return Roles;
    }
}