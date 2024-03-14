import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableUsers1709246757625 implements MigrationInterface {
    private readonly logger = new Logger(CreateTableUsers1709246757625.name);

    public async up(queryRunner: QueryRunner): Promise<void> {
        this.logger.log('Up');
        await queryRunner.query(`
        INSERT INTO "public"."users"(
            "created_at",
            "updated_at",
            "role",
            "name",
            "address",
            "email",
            "password"
        ) VALUES (
            '2024-03-13 07:20:35.543189'::timestamp,
            '2024-03-13 07:20:35.543189'::timestamp,
            'user',
            'User 1',
            'Jalan Testing Raya 1',
            'user1@gmail.com',
            '123456'
         );
        
        INSERT INTO "public"."users"(
            "created_at",
            "updated_at",
            "role",
            "name",
            "address",
            "email",
            "password"
        ) VALUES (
            '2024-03-13 07:21:24.300966'::timestamp,
            '2024-03-13 07:21:24.300966'::timestamp,
            'admin',
            'Admin 1',
            'Jalan Testing Raya 2',
            'admin1@gmail.com',
            '654321'
         );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        this.logger.log('Down');
        await queryRunner.query(`
            drop table users;
        `);
    }

}
