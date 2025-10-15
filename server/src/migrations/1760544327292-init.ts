import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1760544327292 implements MigrationInterface {
    name = 'Init1760544327292'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "question" ("id" varchar PRIMARY KEY NOT NULL, "questionText" text NOT NULL, "options" text, "correctAnswer" text, "type" text NOT NULL DEFAULT ('multiple_choice'), "quizId" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "quiz" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar(255) NOT NULL, "attempts" integer NOT NULL DEFAULT (0), "averageScore" decimal NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar NOT NULL, "noteId" varchar)`);
        await queryRunner.query(`CREATE TABLE "note" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar(255) NOT NULL, "content" text NOT NULL DEFAULT (''), "tags" text, "isShared" boolean NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "study_plan" ("id" varchar PRIMARY KEY NOT NULL, "subject" varchar(255) NOT NULL, "description" text, "scheduledDate" date NOT NULL, "completed" boolean NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "notification" ("id" varchar PRIMARY KEY NOT NULL, "message" text NOT NULL, "read" boolean NOT NULL DEFAULT (0), "scheduledFor" datetime NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "username" varchar(255) NOT NULL, "password" varchar NOT NULL, "email" varchar NOT NULL, "name" varchar(100) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE TABLE "temporary_question" ("id" varchar PRIMARY KEY NOT NULL, "questionText" text NOT NULL, "options" text, "correctAnswer" text, "type" text NOT NULL DEFAULT ('multiple_choice'), "quizId" varchar NOT NULL, CONSTRAINT "FK_4959a4225f25d923111e54c7cd2" FOREIGN KEY ("quizId") REFERENCES "quiz" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_question"("id", "questionText", "options", "correctAnswer", "type", "quizId") SELECT "id", "questionText", "options", "correctAnswer", "type", "quizId" FROM "question"`);
        await queryRunner.query(`DROP TABLE "question"`);
        await queryRunner.query(`ALTER TABLE "temporary_question" RENAME TO "question"`);
        await queryRunner.query(`CREATE TABLE "temporary_quiz" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar(255) NOT NULL, "attempts" integer NOT NULL DEFAULT (0), "averageScore" decimal NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar NOT NULL, "noteId" varchar, CONSTRAINT "FK_52c158a608620611799fd63a927" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_11aa3bf1a8de83e63f73317013b" FOREIGN KEY ("noteId") REFERENCES "note" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_quiz"("id", "title", "attempts", "averageScore", "createdAt", "updatedAt", "userId", "noteId") SELECT "id", "title", "attempts", "averageScore", "createdAt", "updatedAt", "userId", "noteId" FROM "quiz"`);
        await queryRunner.query(`DROP TABLE "quiz"`);
        await queryRunner.query(`ALTER TABLE "temporary_quiz" RENAME TO "quiz"`);
        await queryRunner.query(`CREATE TABLE "temporary_note" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar(255) NOT NULL, "content" text NOT NULL DEFAULT (''), "tags" text, "isShared" boolean NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar NOT NULL, CONSTRAINT "FK_5b87d9d19127bd5d92026017a7b" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_note"("id", "title", "content", "tags", "isShared", "createdAt", "updatedAt", "userId") SELECT "id", "title", "content", "tags", "isShared", "createdAt", "updatedAt", "userId" FROM "note"`);
        await queryRunner.query(`DROP TABLE "note"`);
        await queryRunner.query(`ALTER TABLE "temporary_note" RENAME TO "note"`);
        await queryRunner.query(`CREATE TABLE "temporary_study_plan" ("id" varchar PRIMARY KEY NOT NULL, "subject" varchar(255) NOT NULL, "description" text, "scheduledDate" date NOT NULL, "completed" boolean NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar NOT NULL, CONSTRAINT "FK_205af0c7adc562c681843fc6071" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_study_plan"("id", "subject", "description", "scheduledDate", "completed", "createdAt", "updatedAt", "userId") SELECT "id", "subject", "description", "scheduledDate", "completed", "createdAt", "updatedAt", "userId" FROM "study_plan"`);
        await queryRunner.query(`DROP TABLE "study_plan"`);
        await queryRunner.query(`ALTER TABLE "temporary_study_plan" RENAME TO "study_plan"`);
        await queryRunner.query(`CREATE TABLE "temporary_notification" ("id" varchar PRIMARY KEY NOT NULL, "message" text NOT NULL, "read" boolean NOT NULL DEFAULT (0), "scheduledFor" datetime NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar NOT NULL, CONSTRAINT "FK_1ced25315eb974b73391fb1c81b" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_notification"("id", "message", "read", "scheduledFor", "createdAt", "userId") SELECT "id", "message", "read", "scheduledFor", "createdAt", "userId" FROM "notification"`);
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`ALTER TABLE "temporary_notification" RENAME TO "notification"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" RENAME TO "temporary_notification"`);
        await queryRunner.query(`CREATE TABLE "notification" ("id" varchar PRIMARY KEY NOT NULL, "message" text NOT NULL, "read" boolean NOT NULL DEFAULT (0), "scheduledFor" datetime NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "notification"("id", "message", "read", "scheduledFor", "createdAt", "userId") SELECT "id", "message", "read", "scheduledFor", "createdAt", "userId" FROM "temporary_notification"`);
        await queryRunner.query(`DROP TABLE "temporary_notification"`);
        await queryRunner.query(`ALTER TABLE "study_plan" RENAME TO "temporary_study_plan"`);
        await queryRunner.query(`CREATE TABLE "study_plan" ("id" varchar PRIMARY KEY NOT NULL, "subject" varchar(255) NOT NULL, "description" text, "scheduledDate" date NOT NULL, "completed" boolean NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "study_plan"("id", "subject", "description", "scheduledDate", "completed", "createdAt", "updatedAt", "userId") SELECT "id", "subject", "description", "scheduledDate", "completed", "createdAt", "updatedAt", "userId" FROM "temporary_study_plan"`);
        await queryRunner.query(`DROP TABLE "temporary_study_plan"`);
        await queryRunner.query(`ALTER TABLE "note" RENAME TO "temporary_note"`);
        await queryRunner.query(`CREATE TABLE "note" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar(255) NOT NULL, "content" text NOT NULL DEFAULT (''), "tags" text, "isShared" boolean NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "note"("id", "title", "content", "tags", "isShared", "createdAt", "updatedAt", "userId") SELECT "id", "title", "content", "tags", "isShared", "createdAt", "updatedAt", "userId" FROM "temporary_note"`);
        await queryRunner.query(`DROP TABLE "temporary_note"`);
        await queryRunner.query(`ALTER TABLE "quiz" RENAME TO "temporary_quiz"`);
        await queryRunner.query(`CREATE TABLE "quiz" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar(255) NOT NULL, "attempts" integer NOT NULL DEFAULT (0), "averageScore" decimal NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar NOT NULL, "noteId" varchar)`);
        await queryRunner.query(`INSERT INTO "quiz"("id", "title", "attempts", "averageScore", "createdAt", "updatedAt", "userId", "noteId") SELECT "id", "title", "attempts", "averageScore", "createdAt", "updatedAt", "userId", "noteId" FROM "temporary_quiz"`);
        await queryRunner.query(`DROP TABLE "temporary_quiz"`);
        await queryRunner.query(`ALTER TABLE "question" RENAME TO "temporary_question"`);
        await queryRunner.query(`CREATE TABLE "question" ("id" varchar PRIMARY KEY NOT NULL, "questionText" text NOT NULL, "options" text, "correctAnswer" text, "type" text NOT NULL DEFAULT ('multiple_choice'), "quizId" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "question"("id", "questionText", "options", "correctAnswer", "type", "quizId") SELECT "id", "questionText", "options", "correctAnswer", "type", "quizId" FROM "temporary_question"`);
        await queryRunner.query(`DROP TABLE "temporary_question"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP TABLE "study_plan"`);
        await queryRunner.query(`DROP TABLE "note"`);
        await queryRunner.query(`DROP TABLE "quiz"`);
        await queryRunner.query(`DROP TABLE "question"`);
    }

}
