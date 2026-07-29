import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class Migration1785283300000 implements MigrationInterface {
    name = 'Migration1785283300000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("user", new TableColumn({
            name: "mustSetNewPassword",
            type: "boolean",
            isNullable: false,
            default: false,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("user", "mustSetNewPassword");
    }

}
