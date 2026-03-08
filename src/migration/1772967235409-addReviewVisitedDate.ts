import { MigrationInterface, QueryRunner } from "typeorm";

export class addReviewVisitedDate1772967235409 implements MigrationInterface {
    name = 'addReviewVisitedDate1772967235409'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" ADD "visitedDate" date NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "visitedDate"`);
    }

}
