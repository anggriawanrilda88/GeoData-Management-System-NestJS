import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableUsers1709246757624 implements MigrationInterface {
    private readonly logger = new Logger(CreateTableUsers1709246757624.name);

    public async up(queryRunner: QueryRunner): Promise<void> {
        this.logger.log('Up');
        await queryRunner.query(`
        CREATE TABLE users ( 
            "id" Bigserial NOT NULL,
            "created_at" Timestamp Without Time Zone DEFAULT ('now'::text)::timestamp(6) with time zone NOT NULL,
            "updated_at" Timestamp Without Time Zone DEFAULT ('now'::text)::timestamp(6) with time zone NOT NULL,
            "email" Character Varying NOT NULL,
            "password" Character Varying NOT NULL,
            "name" Character Varying NOT NULL,
            "address" Character Varying NOT NULL,
            "role" "public"."users_role_enum" DEFAULT 'user'::users_role_enum NOT NULL,
            PRIMARY KEY ( "id" ) );
        
        CREATE INDEX "IDX_users_created_at" ON "public"."users" USING btree( "created_at" Asc NULLS Last );
        CREATE INDEX "IDX_users_email" ON "public"."users" USING btree( "email" Asc NULLS Last );
        CREATE INDEX "IDX_users_password" ON "public"."users" USING btree( "password" Asc NULLS Last );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        this.logger.log('Down');
        await queryRunner.query(`
            drop table users;
        `);
    }

}
