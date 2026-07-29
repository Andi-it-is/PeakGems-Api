import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class addUserAndTokens1772876033067 implements MigrationInterface {
    name = 'addUserAndTokens1772876033067'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "user",
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "username", type: "varchar", isNullable: false, isUnique: true },
                { name: "passwordHash", type: "varchar", isNullable: false },
                { name: "disabled", type: "boolean", isNullable: false, default: true },
                { name: "failedLoginTries", type: "int", isNullable: false, default: 0 },
                { name: "role", type: "varchar", isNullable: false },
                { name: "createdAt", type: "timestamp", isNullable: false, default: "CURRENT_TIMESTAMP" },
                { name: "updatedAt", type: "timestamp", isNullable: false, default: "CURRENT_TIMESTAMP" },
            ],
        }), true);

        await queryRunner.createTable(new Table({
            name: "refresh_token",
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                // Wird per crypto.randomUUID() im Code gesetzt (kein DB-Default, damit Postgres/MySQL gleichermaßen funktionieren)
                { name: "token", type: "varchar", length: "36", isUnique: true },
                { name: "validUntil", type: "timestamp", isNullable: false },
                { name: "lastUsed", type: "timestamp", isNullable: false, default: "CURRENT_TIMESTAMP" },
                { name: "isActive", type: "boolean", isNullable: false, default: true },
                { name: "createdAt", type: "timestamp", isNullable: false, default: "CURRENT_TIMESTAMP" },
                { name: "updatedAt", type: "timestamp", isNullable: false, default: "CURRENT_TIMESTAMP" },
                { name: "userId", type: "int", isNullable: true },
            ],
        }), true);

        await queryRunner.createForeignKey("refresh_token", new TableForeignKey({
            columnNames: ["userId"],
            referencedTableName: "user",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "NO ACTION",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const refreshTokenTable = await queryRunner.getTable("refresh_token");
        const foreignKey = refreshTokenTable.foreignKeys.find(fk => fk.columnNames.indexOf("userId") !== -1);
        await queryRunner.dropForeignKey("refresh_token", foreignKey);
        await queryRunner.dropTable("refresh_token");
        await queryRunner.dropTable("user");
    }

}
