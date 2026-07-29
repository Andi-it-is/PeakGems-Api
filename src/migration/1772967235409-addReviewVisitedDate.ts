import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class addReviewVisitedDate1772967235409 implements MigrationInterface {
    name = 'addReviewVisitedDate1772967235409'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("review", new TableColumn({
            name: "visitedDate",
            type: "date",
            isNullable: false,
            default: "CURRENT_DATE",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("review", "visitedDate");
    }

}
