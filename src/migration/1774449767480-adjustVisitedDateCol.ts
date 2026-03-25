import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1774449767480 implements MigrationInterface {
    name = 'Migration1774449767480'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "visitedDate"`);
        await queryRunner.query(`ALTER TABLE "review" ADD "visitedDate" character varying NOT NULL DEFAULT '01.01.1970'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "visitedDate"`);
        await queryRunner.query(`ALTER TABLE "review" ADD "visitedDate" date NOT NULL DEFAULT now()`);
    }

}
