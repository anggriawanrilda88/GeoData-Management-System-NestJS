import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class GeoLocations {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  type: string;

  @Column()
  geometry_type: string;

  @Column()
  geometry_coordinates_lat: string;

  @Column()
  geometry_coordinates_long: string;

  @Column()
  properties_name: string;

  constructor(entity: Partial<GeoLocations>) {
    Object.assign(this, entity);
  }
}
