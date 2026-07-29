import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class Migration1785283200000 implements MigrationInterface {
    name = 'Migration1785283200000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("user", new TableColumn({
            name: "avatar",
            type: "varchar",
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("user", "avatar");
    }

}
