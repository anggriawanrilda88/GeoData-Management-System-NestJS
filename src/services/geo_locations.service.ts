import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { GeoLocations } from '../models/geo_locations.entity';
import { GeoJSON } from './interfaces/geo-json.interface';

@Injectable()
export class GeoLocationsService {
  constructor(
    @InjectRepository(GeoLocations)
    private readonly geoLocationsRepository: Repository<GeoLocations>,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) { }

  async find(
    limit?: number,
    offset?: number,
    sort?: "ASC" | "DESC",
    sortBy?: string,
    keyword?: string,
  ): Promise<{ count: number, data: any }> {
    const queryBuilder = this.geoLocationsRepository.createQueryBuilder('GeoLocations');

    if (keyword) {
      queryBuilder.orWhere(`geo_locations.type ILIKE :keyword`, { keyword: `%${keyword}%` });
      queryBuilder.orWhere(`geo_locations.geometry_type ILIKE :keyword`, { keyword: `%${keyword}%` });
      queryBuilder.orWhere(`geo_locations.properties_name ILIKE :keyword`, { keyword: `%${keyword}%` });
    }

    // get count for pagination
    const count = queryBuilder.getCount();

    if (offset) {
      queryBuilder.offset(Number(offset));
    }

    if (limit) {
      queryBuilder.limit(limit);
    }

    queryBuilder.addOrderBy(sortBy, sort);

    return {
      count: await count,
      data: await queryBuilder.getMany(),
    };
  }

  async saveMultipleData(data: GeoJSON[]) {
    try {
      // Lakukan iterasi dan simpan setiap fitur ke dalam database
      for (const feature of data) {
        let geoEntity: any = {
          type: feature.type,
          properties_name: feature.properties.name,
          geometry_type: feature.geometry.type,
          geometry_coordinates_lat: feature.geometry.coordinates[0].toString(),
          geometry_coordinates_long: feature.geometry.coordinates[1].toString(),
        };

        const geoData = new GeoLocations(geoEntity);
        await this.entityManager.save(geoData);
      }
    } catch (error) {
      console.error('Error saving GeoJSON data to database:', error);
      throw new Error('Error saving GeoJSON data to database.');
    }
  }
}
