import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class Migration1785283500000 implements MigrationInterface {
    name = 'Migration1785283500000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("location", new TableColumn({
            name: "latitude",
            type: "double precision",
            isNullable: true,
        }));

        await queryRunner.addColumn("location", new TableColumn({
            name: "longitude",
            type: "double precision",
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("location", "longitude");
        await queryRunner.dropColumn("location", "latitude");
    }

}
