import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class Migration1774449767480 implements MigrationInterface {
    name = 'Migration1774449767480'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("review", "visitedDate");
        await queryRunner.addColumn("review", new TableColumn({
            name: "visitedDate",
            type: "varchar",
            isNullable: false,
            default: "'01.01.1970'",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("review", "visitedDate");
        await queryRunner.addColumn("review", new TableColumn({
            name: "visitedDate",
            type: "date",
            isNullable: false,
            default: "CURRENT_DATE",
        }));
    }

}
