import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Migration1785283700000 implements MigrationInterface {
    name = 'Migration1785283700000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "custom_badge",
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "title", type: "varchar", isNullable: false },
                { name: "color", type: "varchar", isNullable: false },
                { name: "textColor", type: "varchar", isNullable: false },
                { name: "createdAt", type: "timestamp", isNullable: false, default: "CURRENT_TIMESTAMP" },
                { name: "updatedAt", type: "timestamp", isNullable: false, default: "CURRENT_TIMESTAMP" },
            ],
        }), true);

        // m:n User <-> CustomBadge. Zusammengesetzter PK verhindert, dass ein User dasselbe Badge doppelt hat.
        // Index-/FK-Namen werden von TypeORM erzeugt und entsprechen damit dem @JoinTable in User.ts.
        await queryRunner.createTable(new Table({
            name: "user_custom_badge",
            columns: [
                { name: "userId", type: "int", isPrimary: true, isNullable: false },
                { name: "customBadgeId", type: "int", isPrimary: true, isNullable: false },
            ],
            indices: [
                { columnNames: ["userId"] },
                { columnNames: ["customBadgeId"] },
            ],
            foreignKeys: [
                { columnNames: ["userId"], referencedTableName: "user", referencedColumnNames: ["id"], onDelete: "CASCADE", onUpdate: "CASCADE" },
                { columnNames: ["customBadgeId"], referencedTableName: "custom_badge", referencedColumnNames: ["id"], onDelete: "CASCADE", onUpdate: "CASCADE" },
            ],
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // dropTable entfernt auch die Fremdschlüssel/Indizes der Join-Tabelle
        await queryRunner.dropTable("user_custom_badge", true, true, true);
        await queryRunner.dropTable("custom_badge");
    }

}
