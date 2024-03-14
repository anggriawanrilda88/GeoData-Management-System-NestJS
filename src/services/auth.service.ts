import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) { }

    validateToken(token: string): any {
        try {
            const decoded = this.jwtService.verify(token);
            return decoded;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }

    generateToken(payload: object): any {
        try {
            const token = this.jwtService.sign(payload);
            return token;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}