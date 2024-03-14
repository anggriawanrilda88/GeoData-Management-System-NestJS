import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { GeoJSONInterceptor } from './geojson.interceptor';
import { Observable, of } from 'rxjs';
import { readFileAsync } from './file-utils';

describe('GeoJSONInterceptor', () => {
    let interceptor: GeoJSONInterceptor;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [GeoJSONInterceptor],
        }).compile();

        interceptor = module.get<GeoJSONInterceptor>(GeoJSONInterceptor);
    });

    it('should be defined', () => {
        expect(interceptor).toBeDefined();
    });
});
