import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { GeoLocationsService } from './geo_locations.service';
import { GeoLocations } from '../models/geo_locations.entity';
import { equal } from 'assert';

describe('GeoLocationsService', () => {
    let service: GeoLocationsService;
    let geoLocationsRepository: Repository<GeoLocations>;
    let geoLocationsEntityManager: EntityManager;

    const queryBuilderMock = {
        getCount: jest.fn().mockResolvedValue(1),
        select: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockReturnValue([{
            id: 1,
            type: "Feature",
            geometry_type: "Point",
            geometry_coordinates_lat: "125.6",
            geometry_coordinates_long: "10.1",
            properties_name: "Dinagat Islands",
        }]),
    };

    const geoLocationsRepositoryMock = {
        createQueryBuilder: jest.fn(() => queryBuilderMock),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GeoLocationsService,
                {
                    provide: getRepositoryToken(GeoLocations),
                    useValue: geoLocationsRepositoryMock,
                },
                {
                    provide: EntityManager,
                    useValue: {
                        save: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<GeoLocationsService>(GeoLocationsService);
        geoLocationsRepository = module.get<Repository<GeoLocations>>(getRepositoryToken(GeoLocations));
        geoLocationsEntityManager = module.get<EntityManager>(EntityManager);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('Get list geo location data', () => {
        it('should return geo locations data', async () => {
            const expectedData = {
                count: 1,
                data: [{
                    id: 1,
                    type: "Feature",
                    geometry_type: "Point",
                    geometry_coordinates_lat: "125.6",
                    geometry_coordinates_long: "10.1",
                    properties_name: "Dinagat Islands",
                }],
            };

            const result = await service.find();
            expect(result).toEqual(expectedData);
        });
    });

    describe('Create list geo location data', () => {
        it('should return geo locations success create', async () => {
            const result = await service.saveMultipleData([
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            125.6,
                            10.1
                        ]
                    },
                    "properties": {
                        "name": "Dinagat Islands"
                    }
                }
            ]);
        });
        it('should return geo locations error create', async () => {
            try {
                jest.spyOn(geoLocationsEntityManager, 'save').mockRejectedValue(new Error('Failed to getCount'));
                const result = await service.saveMultipleData([
                    {
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                125.6,
                                10.1
                            ]
                        },
                        "properties": {
                            "name": "Dinagat Islands"
                        }
                    }
                ]);
            } catch (error) {
                equal(error.message, "Error saving GeoJSON data to database.");
            }
        });
    });
});