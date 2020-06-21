import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateInitialTables1592753587406 implements MigrationInterface {
    name = 'CreateInitialTables1592753587406'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "garment_sub_category" ("id" SERIAL NOT NULL, "slug" character varying NOT NULL, "name" character varying NOT NULL, "parentCategoryId" integer, CONSTRAINT "UQ_NAME_CATEGORY" UNIQUE ("name", "parentCategoryId"), CONSTRAINT "UQ_SLUG_CATEGORY" UNIQUE ("slug", "parentCategoryId"), CONSTRAINT "PK_37c319b081fd899447b2b51f1d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "garment_category" ("id" SERIAL NOT NULL, "slug" character varying NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_f28998166da2413fe5f478441db" UNIQUE ("slug"), CONSTRAINT "UQ_44e9a77678482e3e60b00b2abae" UNIQUE ("name"), CONSTRAINT "PK_11b1146d590e4879878c2593614" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "first_name" character varying, "last_name" character varying, "password" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "garment" ("id" SERIAL NOT NULL, "brand" character varying NOT NULL, "last_name" character varying, "password" character varying NOT NULL, "ownerId" integer, "categoryId" integer, "subCategoryId" integer, CONSTRAINT "PK_9a36c35a6a4c8c0b2897743038b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "garment_sub_category" ADD CONSTRAINT "FK_a1332994c3c78f8f4523262ed81" FOREIGN KEY ("parentCategoryId") REFERENCES "garment_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "garment" ADD CONSTRAINT "FK_355f460bed6868c605d35800655" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "garment" ADD CONSTRAINT "FK_80d455d43d996bd3d48775259cc" FOREIGN KEY ("categoryId") REFERENCES "garment_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "garment" ADD CONSTRAINT "FK_89a69f56380892f19e0ab528769" FOREIGN KEY ("subCategoryId") REFERENCES "garment_sub_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "garment" DROP CONSTRAINT "FK_89a69f56380892f19e0ab528769"`);
        await queryRunner.query(`ALTER TABLE "garment" DROP CONSTRAINT "FK_80d455d43d996bd3d48775259cc"`);
        await queryRunner.query(`ALTER TABLE "garment" DROP CONSTRAINT "FK_355f460bed6868c605d35800655"`);
        await queryRunner.query(`ALTER TABLE "garment_sub_category" DROP CONSTRAINT "FK_a1332994c3c78f8f4523262ed81"`);
        await queryRunner.query(`DROP TABLE "garment"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "garment_category"`);
        await queryRunner.query(`DROP TABLE "garment_sub_category"`);
    }

}
