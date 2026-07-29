import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class Migration1782818621985 implements MigrationInterface {
    name = 'Migration1782818621985'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "location_image",
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "filename", type: "varchar", isNullable: false },
                { name: "url", type: "varchar", isNullable: false },
                { name: "altText", type: "varchar", isNullable: true },
                { name: "createdAt", type: "timestamp", isNullable: false, default: "CURRENT_TIMESTAMP" },
                { name: "locationId", type: "int", isNullable: false },
            ],
        }), true);

        await queryRunner.createForeignKey("location_image", new TableForeignKey({
            columnNames: ["locationId"],
            referencedTableName: "location",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "NO ACTION",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("location_image");
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf("locationId") !== -1);
        await queryRunner.dropForeignKey("location_image", foreignKey);
        await queryRunner.dropTable("location_image");
    }

}
