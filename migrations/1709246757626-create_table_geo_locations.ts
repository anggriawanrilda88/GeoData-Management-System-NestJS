import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableUsers1709246757626 implements MigrationInterface {
    private readonly logger = new Logger(CreateTableUsers1709246757626.name);

    public async up(queryRunner: QueryRunner): Promise<void> {
        this.logger.log('Up');
        await queryRunner.query(`
        CREATE TABLE "public"."geo_locations" ( 
            "id" Bigserial NOT NULL,
            "type" Character Varying NOT NULL,
            "geometry_type" Character Varying NOT NULL,
            "geometry_coordinates_lat" Character Varying NOT NULL,
            "geometry_coordinates_long" Character Varying NOT NULL,
            "properties_name" Character Varying NOT NULL,
            PRIMARY KEY ( "id" ) );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        this.logger.log('Down');
        await queryRunner.query(`
            drop table geo_locations;
        `);
    }

}
