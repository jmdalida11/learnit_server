import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSession1760765954570 implements MigrationInterface {
    name = 'AddSession1760765954570'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "session" ("id" varchar(255) PRIMARY KEY NOT NULL, "expiredAt" bigint NOT NULL, "json" text NOT NULL, "destroyedAt" datetime)`);
        await queryRunner.query(`CREATE INDEX "IDX_28c5d1d16da7908c97c9bc2f74" ON "session" ("expiredAt") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_28c5d1d16da7908c97c9bc2f74"`);
        await queryRunner.query(`DROP TABLE "session"`);
    }

}
