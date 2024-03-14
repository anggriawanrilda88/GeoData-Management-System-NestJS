import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';

describe('RolesService', () => {
    let service: RolesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RolesService],
        }).compile();

        service = module.get<RolesService>(RolesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getRoles', () => {
        it('should return roles', () => {
            const expectedRoles = {
                user: ['user.detail', 'geo-locations.list'],
                admin: ['user.list', 'user.detail', 'geo-locations.create', 'geo-locations.list'],
            };

            expect(service.getRoles()).toEqual(expectedRoles);
        });
    });
});