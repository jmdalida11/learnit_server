import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCategories1775040224239 implements MigrationInterface {
    name = 'AddCategories1775040224239'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "category" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar(255) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar NOT NULL)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_4760fde1380c4d39297a2e1f98" ON "category" ("userId", "name") `);
        await queryRunner.query(`CREATE TABLE "category_quizzes_quiz" ("categoryId" varchar NOT NULL, "quizId" varchar NOT NULL, PRIMARY KEY ("categoryId", "quizId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_96be84296fad52be2847551922" ON "category_quizzes_quiz" ("categoryId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5a4caaee49d0c9194b5547c6d6" ON "category_quizzes_quiz" ("quizId") `);
        await queryRunner.query(`DROP INDEX "IDX_4760fde1380c4d39297a2e1f98"`);
        await queryRunner.query(`CREATE TABLE "temporary_category" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar(255) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar NOT NULL, CONSTRAINT "FK_32b856438dffdc269fa84434d9f" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_category"("id", "name", "createdAt", "updatedAt", "userId") SELECT "id", "name", "createdAt", "updatedAt", "userId" FROM "category"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`ALTER TABLE "temporary_category" RENAME TO "category"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_4760fde1380c4d39297a2e1f98" ON "category" ("userId", "name") `);
        await queryRunner.query(`DROP INDEX "IDX_96be84296fad52be2847551922"`);
        await queryRunner.query(`DROP INDEX "IDX_5a4caaee49d0c9194b5547c6d6"`);
        await queryRunner.query(`CREATE TABLE "temporary_category_quizzes_quiz" ("categoryId" varchar NOT NULL, "quizId" varchar NOT NULL, CONSTRAINT "FK_96be84296fad52be28475519229" FOREIGN KEY ("categoryId") REFERENCES "category" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_5a4caaee49d0c9194b5547c6d6c" FOREIGN KEY ("quizId") REFERENCES "quiz" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("categoryId", "quizId"))`);
        await queryRunner.query(`INSERT INTO "temporary_category_quizzes_quiz"("categoryId", "quizId") SELECT "categoryId", "quizId" FROM "category_quizzes_quiz"`);
        await queryRunner.query(`DROP TABLE "category_quizzes_quiz"`);
        await queryRunner.query(`ALTER TABLE "temporary_category_quizzes_quiz" RENAME TO "category_quizzes_quiz"`);
        await queryRunner.query(`CREATE INDEX "IDX_96be84296fad52be2847551922" ON "category_quizzes_quiz" ("categoryId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5a4caaee49d0c9194b5547c6d6" ON "category_quizzes_quiz" ("quizId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_5a4caaee49d0c9194b5547c6d6"`);
        await queryRunner.query(`DROP INDEX "IDX_96be84296fad52be2847551922"`);
        await queryRunner.query(`ALTER TABLE "category_quizzes_quiz" RENAME TO "temporary_category_quizzes_quiz"`);
        await queryRunner.query(`CREATE TABLE "category_quizzes_quiz" ("categoryId" varchar NOT NULL, "quizId" varchar NOT NULL, PRIMARY KEY ("categoryId", "quizId"))`);
        await queryRunner.query(`INSERT INTO "category_quizzes_quiz"("categoryId", "quizId") SELECT "categoryId", "quizId" FROM "temporary_category_quizzes_quiz"`);
        await queryRunner.query(`DROP TABLE "temporary_category_quizzes_quiz"`);
        await queryRunner.query(`CREATE INDEX "IDX_5a4caaee49d0c9194b5547c6d6" ON "category_quizzes_quiz" ("quizId") `);
        await queryRunner.query(`CREATE INDEX "IDX_96be84296fad52be2847551922" ON "category_quizzes_quiz" ("categoryId") `);
        await queryRunner.query(`DROP INDEX "IDX_4760fde1380c4d39297a2e1f98"`);
        await queryRunner.query(`ALTER TABLE "category" RENAME TO "temporary_category"`);
        await queryRunner.query(`CREATE TABLE "category" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar(255) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "category"("id", "name", "createdAt", "updatedAt", "userId") SELECT "id", "name", "createdAt", "updatedAt", "userId" FROM "temporary_category"`);
        await queryRunner.query(`DROP TABLE "temporary_category"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_4760fde1380c4d39297a2e1f98" ON "category" ("userId", "name") `);
        await queryRunner.query(`DROP INDEX "IDX_5a4caaee49d0c9194b5547c6d6"`);
        await queryRunner.query(`DROP INDEX "IDX_96be84296fad52be2847551922"`);
        await queryRunner.query(`DROP TABLE "category_quizzes_quiz"`);
        await queryRunner.query(`DROP INDEX "IDX_4760fde1380c4d39297a2e1f98"`);
        await queryRunner.query(`DROP TABLE "category"`);
    }

}
