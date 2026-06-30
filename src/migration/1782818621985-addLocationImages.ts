import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1782818621985 implements MigrationInterface {
    name = 'Migration1782818621985'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "location_image" ("id" SERIAL NOT NULL, "filename" character varying NOT NULL, "url" character varying NOT NULL, "altText" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "locationId" integer NOT NULL, CONSTRAINT "PK_dfa981be0cd5c3c2f8c37915564" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "location_image" ADD CONSTRAINT "FK_b16e8454e89e24bd0aacc26b6d7" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location_image" DROP CONSTRAINT "FK_b16e8454e89e24bd0aacc26b6d7"`);
        await queryRunner.query(`DROP TABLE "location_image"`);
    }

}
