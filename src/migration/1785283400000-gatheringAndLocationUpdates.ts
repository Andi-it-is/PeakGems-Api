import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey, TableIndex } from "typeorm";

export class Migration1785283400000 implements MigrationInterface {
    name = 'Migration1785283400000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Location: description
        await queryRunner.addColumn("location", new TableColumn({
            name: "description",
            type: "text",
            isNullable: true,
        }));

        // Gathering: date/time -> title/description/startAt, locationId verpflichtend
        await queryRunner.addColumn("gathering", new TableColumn({
            name: "title",
            type: "varchar",
            isNullable: false,
            default: "'Unbenanntes Treffen'",
        }));

        await queryRunner.addColumn("gathering", new TableColumn({
            name: "description",
            type: "text",
            isNullable: true,
        }));

        await queryRunner.addColumn("gathering", new TableColumn({
            name: "startAt",
            type: "timestamp",
            isNullable: false,
            default: "CURRENT_TIMESTAMP",
        }));

        await queryRunner.dropColumn("gathering", "date");
        await queryRunner.dropColumn("gathering", "time");

        // MySQL (anders als Postgres) verweigert changeColumn auf einer Spalte, die Teil einer
        // Foreign Key Constraint ist -> FK vorher droppen, Spalte anpassen, FK neu anlegen.
        const gatheringTableBefore = await queryRunner.getTable("gathering");
        const locationFk = gatheringTableBefore.foreignKeys.find(fk => fk.columnNames.indexOf("locationId") !== -1);
        if (locationFk) {
            await queryRunner.dropForeignKey("gathering", locationFk);
        }

        await queryRunner.changeColumn("gathering", "locationId", new TableColumn({
            name: "locationId",
            type: "int",
            isNullable: false,
        }));

        await queryRunner.createForeignKey("gathering", new TableForeignKey({
            columnNames: ["locationId"],
            referencedTableName: "location",
            referencedColumnNames: ["id"],
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION",
        }));

        // Neue Tabelle: gathering_attendee (Zu-/Absagen pro Nutzer und Treffen)
        await queryRunner.createTable(new Table({
            name: "gathering_attendee",
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "status", type: "varchar", isNullable: false },
                { name: "createdAt", type: "timestamp", isNullable: false, default: "CURRENT_TIMESTAMP" },
                { name: "updatedAt", type: "timestamp", isNullable: false, default: "CURRENT_TIMESTAMP" },
                { name: "gatheringId", type: "int", isNullable: false },
                { name: "userId", type: "int", isNullable: false },
            ],
        }), true);

        await queryRunner.createForeignKey("gathering_attendee", new TableForeignKey({
            columnNames: ["gatheringId"],
            referencedTableName: "gathering",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "NO ACTION",
        }));

        await queryRunner.createForeignKey("gathering_attendee", new TableForeignKey({
            columnNames: ["userId"],
            referencedTableName: "user",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "NO ACTION",
        }));

        await queryRunner.createIndex("gathering_attendee", new TableIndex({
            name: "UQ_gathering_attendee_gathering_user",
            columnNames: ["gatheringId", "userId"],
            isUnique: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("gathering_attendee");

        const gatheringTableBefore = await queryRunner.getTable("gathering");
        const locationFk = gatheringTableBefore.foreignKeys.find(fk => fk.columnNames.indexOf("locationId") !== -1);
        if (locationFk) {
            await queryRunner.dropForeignKey("gathering", locationFk);
        }

        await queryRunner.changeColumn("gathering", "locationId", new TableColumn({
            name: "locationId",
            type: "int",
            isNullable: true,
        }));

        await queryRunner.createForeignKey("gathering", new TableForeignKey({
            columnNames: ["locationId"],
            referencedTableName: "location",
            referencedColumnNames: ["id"],
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION",
        }));

        await queryRunner.addColumn("gathering", new TableColumn({
            name: "date",
            type: "timestamp",
            isNullable: false,
            default: "CURRENT_TIMESTAMP",
        }));
        await queryRunner.addColumn("gathering", new TableColumn({
            name: "time",
            type: "varchar",
            isNullable: false,
            default: "'00:00'",
        }));

        await queryRunner.dropColumn("gathering", "startAt");
        await queryRunner.dropColumn("gathering", "description");
        await queryRunner.dropColumn("gathering", "title");

        await queryRunner.dropColumn("location", "description");
    }

}
