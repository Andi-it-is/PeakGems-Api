import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class addReviewVisitedDate1772967235409 implements MigrationInterface {
    name = 'addReviewVisitedDate1772967235409'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Als varchar statt date: MySQL erlaubt CURRENT_DATE nicht als Default für DATE-Spalten
        // (nur für TIMESTAMP/DATETIME), Postgres würde das zwar akzeptieren, hier aber dialekt-
        // übergreifend einheitlich als String mit festem Default.
        await queryRunner.addColumn("review", new TableColumn({
            name: "visitedDate",
            type: "varchar",
            isNullable: false,
            default: "'01.01.1970'",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("review", "visitedDate");
    }

}
