import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateQuestion1775045359947 implements MigrationInterface {
    name = 'UpdateQuestion1775045359947'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_question" ("id" varchar PRIMARY KEY NOT NULL, "question" text NOT NULL, "options" text, "correctAnswer" text, "type" text NOT NULL DEFAULT ('multiple_choice'), "quizId" varchar NOT NULL, CONSTRAINT "FK_4959a4225f25d923111e54c7cd2" FOREIGN KEY ("quizId") REFERENCES "quiz" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_question"("id", "question", "options", "correctAnswer", "type", "quizId") SELECT "id", "questionText", "options", "correctAnswer", "type", "quizId" FROM "question"`);
        await queryRunner.query(`DROP TABLE "question"`);
        await queryRunner.query(`ALTER TABLE "temporary_question" RENAME TO "question"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" RENAME TO "temporary_question"`);
        await queryRunner.query(`CREATE TABLE "question" ("id" varchar PRIMARY KEY NOT NULL, "questionText" text NOT NULL, "options" text, "correctAnswer" text, "type" text NOT NULL DEFAULT ('multiple_choice'), "quizId" varchar NOT NULL, CONSTRAINT "FK_4959a4225f25d923111e54c7cd2" FOREIGN KEY ("quizId") REFERENCES "quiz" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "question"("id", "questionText", "options", "correctAnswer", "type", "quizId") SELECT "id", "question", "options", "correctAnswer", "type", "quizId" FROM "temporary_question"`);
        await queryRunner.query(`DROP TABLE "temporary_question"`);
    }

}
