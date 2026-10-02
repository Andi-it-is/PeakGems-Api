import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class Migration1785283600000 implements MigrationInterface {
    name = 'Migration1785283600000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Bestehende Locations bekommen "DefaultStadt" und müssen danach manuell gepflegt werden
        await queryRunner.addColumn("location", new TableColumn({
            name: "city",
            type: "varchar",
            isNullable: false,
            default: "'DefaultStadt'",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("location", "city");
    }

}
