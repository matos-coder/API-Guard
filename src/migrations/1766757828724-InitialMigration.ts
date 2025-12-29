import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1766757828724 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "analyze_type_enum" AS ENUM('USER_AGENT', 'IP_RANGE', 'HEADER_PATTERN', 'PATH_PATTERN')`);
        await queryRunner.query(`CREATE TABLE "analyze" ("id" SERIAL NOT NULL, "type" "analyze_type_enum" NOT NULL, "pattern" character varying NOT NULL, "action" character varying(5) NOT NULL DEFAULT 'BLOCK', "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_analyze" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_analyze_pattern" ON "analyze" ("pattern")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_analyze_pattern"`);
        await queryRunner.query(`DROP TABLE "analyze"`);
        await queryRunner.query(`DROP TYPE "analyze_type_enum"`);
    }

}
