import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class addReviewLocationGathering1772878996458 implements MigrationInterface {
    name = 'addReviewLocationGathering1772878996458'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "gathering",
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "date", type: "timestamp", isNullable: false },
                { name: "time", type: "varchar", isNullable: false },
                { name: "createdAt", type: "timestamp", isNullable: false, default: "CURRENT_TIMESTAMP" },
                { name: "updatedAt", type: "timestamp", isNullable: false, default: "CURRENT_TIMESTAMP" },
                { name: "locationId", type: "int", isNullable: true },
            ],
        }), true);

        await queryRunner.createTable(new Table({
            name: "location",
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "address", type: "varchar", isNullable: false },
                { name: "name", type: "varchar", isNullable: false },
                { name: "status", type: "varchar", isNullable: false },
                { name: "type", type: "varchar", isNullable: false },
                { name: "createdAt", type: "timestamp", isNullable: false, default: "CURRENT_TIMESTAMP" },
                { name: "updatedAt", type: "timestamp", isNullable: false, default: "CURRENT_TIMESTAMP" },
            ],
        }), true);

        await queryRunner.createTable(new Table({
            name: "review",
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "rating", type: "float", isNullable: false },
                { name: "orderedDish", type: "varchar", isNullable: true },
                { name: "comment", type: "text", isNullable: false },
                { name: "createdAt", type: "timestamp", isNullable: false, default: "CURRENT_TIMESTAMP" },
                { name: "updatedAt", type: "timestamp", isNullable: false, default: "CURRENT_TIMESTAMP" },
                { name: "userId", type: "int", isNullable: true },
                { name: "locationId", type: "int", isNullable: true },
            ],
        }), true);

        await queryRunner.createForeignKey("gathering", new TableForeignKey({
            columnNames: ["locationId"],
            referencedTableName: "location",
            referencedColumnNames: ["id"],
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION",
        }));

        await queryRunner.createForeignKey("review", new TableForeignKey({
            columnNames: ["userId"],
            referencedTableName: "user",
            referencedColumnNames: ["id"],
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION",
        }));

        await queryRunner.createForeignKey("review", new TableForeignKey({
            columnNames: ["locationId"],
            referencedTableName: "location",
            referencedColumnNames: ["id"],
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const reviewTable = await queryRunner.getTable("review");
        const reviewLocationFk = reviewTable.foreignKeys.find(fk => fk.columnNames.indexOf("locationId") !== -1);
        const reviewUserFk = reviewTable.foreignKeys.find(fk => fk.columnNames.indexOf("userId") !== -1);
        await queryRunner.dropForeignKey("review", reviewLocationFk);
        await queryRunner.dropForeignKey("review", reviewUserFk);

        const gatheringTable = await queryRunner.getTable("gathering");
        const gatheringLocationFk = gatheringTable.foreignKeys.find(fk => fk.columnNames.indexOf("locationId") !== -1);
        await queryRunner.dropForeignKey("gathering", gatheringLocationFk);

        await queryRunner.dropTable("review");
        await queryRunner.dropTable("location");
        await queryRunner.dropTable("gathering");
    }

}
