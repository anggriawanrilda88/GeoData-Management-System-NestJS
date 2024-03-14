import { Injectable, NestInterceptor, ExecutionContext, CallHandler, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { readFileAsync } from './file-utils';

@Injectable()
export class GeoJSONInterceptor implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        try {
            const jsonData = await readFileAsync('./storage/geo-locations/' + request.file.filename);

            if (!Array.isArray(jsonData)) {
                throw new ForbiddenException('Invalid GeoJSON: Top-level structure must be an array.');
            }

            for (const feature of jsonData) {
                if (
                    !feature ||
                    typeof feature !== 'object' ||
                    feature.type !== 'Feature' ||
                    !feature.geometry ||
                    !feature.geometry.type ||
                    feature.geometry.type !== 'Point' ||
                    !Array.isArray(feature.geometry.coordinates) ||
                    feature.geometry.coordinates.length !== 2 ||
                    typeof feature.properties !== 'object' ||
                    typeof feature.properties.name !== 'string'
                ) {
                    throw new ForbiddenException('Invalid GeoJSON: Each element in the array must be a valid Feature.');
                }
            }

            // Mengirimkan jsonData ke dalam method controller
            request.geoLocationData = jsonData;

            return next.handle();
        } catch (error) {
            throw new ForbiddenException(error);
        }
    }
}