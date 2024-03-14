import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableUsers1709246757623 implements MigrationInterface {
    private readonly logger = new Logger(CreateTableUsers1709246757623.name);

    public async up(queryRunner: QueryRunner): Promise<void> {
        this.logger.log('Up');
        await queryRunner.query(`
        CREATE TYPE "public"."users_role_enum" AS Enum( 'admin', 'user' );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        this.logger.log('Down');
        await queryRunner.query(`
            DROP TYPE IF EXISTS "public"."users_role_enum";
        `);
    }

}
