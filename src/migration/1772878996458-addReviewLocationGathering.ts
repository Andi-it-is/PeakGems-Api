import { MigrationInterface, QueryRunner } from "typeorm";

export class addReviewLocationGathering1772878996458 implements MigrationInterface {
    name = 'addReviewLocationGathering1772878996458'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "gathering" ("id" SERIAL NOT NULL, "date" TIMESTAMP NOT NULL, "time" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "locationId" integer, CONSTRAINT "PK_4ae08ea2046e81e1646e924d6d4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "location" ("id" SERIAL NOT NULL, "address" character varying NOT NULL,"name" character varying NOT NULL, "status" character varying NOT NULL, "type" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "review" ("id" SERIAL NOT NULL, "rating" double precision NOT NULL, "orderedDish" character varying, "comment" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "locationId" integer, CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "gathering" ADD CONSTRAINT "FK_125f8eaf037f9b54fd6d573ae31" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_1337f93918c70837d3cea105d39" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_f54881daf6362511a79f3b323cd" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_f54881daf6362511a79f3b323cd"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_1337f93918c70837d3cea105d39"`);
        await queryRunner.query(`ALTER TABLE "gathering" DROP CONSTRAINT "FK_125f8eaf037f9b54fd6d573ae31"`);
        await queryRunner.query(`DROP TABLE "review"`);
        await queryRunner.query(`DROP TABLE "location"`);
        await queryRunner.query(`DROP TABLE "gathering"`);
    }

}
