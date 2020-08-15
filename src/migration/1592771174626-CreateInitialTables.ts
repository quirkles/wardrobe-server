import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialTables1592771174626 implements MigrationInterface {
    name = 'CreateInitialTables1592771174626';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        await queryRunner.query(
            `CREATE TABLE "garment_sub_category"
                 (
                     "id"               uuid DEFAULT uuid_generate_v4(),
                     "slug"             character varying NOT NULL,
                     "name"             character varying NOT NULL,
                     "parentCategoryId" uuid,
                     CONSTRAINT "UQ_NAME_CATEGORY" UNIQUE ("name", "parentCategoryId"),
                     CONSTRAINT "UQ_SLUG_CATEGORY" UNIQUE ("slug", "parentCategoryId"),
                     CONSTRAINT "PK_37c319b081fd899447b2b51f1d9" PRIMARY KEY ("id")
                 )`,
        );
        await queryRunner.query(
            `CREATE TABLE "garment_category"
                 (
                     "id"   uuid DEFAULT uuid_generate_v4(),
                     "slug" character varying NOT NULL,
                     "name" character varying NOT NULL,
                     CONSTRAINT "UQ_f28998166da2413fe5f478441db" UNIQUE ("slug"),
                     CONSTRAINT "UQ_44e9a77678482e3e60b00b2abae" UNIQUE ("name"),
                     CONSTRAINT "PK_11b1146d590e4879878c2593614" PRIMARY KEY ("id")
                 )`,
        );
        await queryRunner.query(
            `CREATE TABLE "user"
                 (
                     "id"         uuid DEFAULT uuid_generate_v4(),
                     "email"      character varying NOT NULL,
                     "first_name" character varying,
                     "last_name"  character varying,
                     "password"   character varying NOT NULL,
                     CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
                     CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
                 )`,
        );
        await queryRunner.query(
            `CREATE TABLE "garment_image"
                 (
                     "id"        uuid DEFAULT uuid_generate_v4(),
                     "imageUrl"  character varying NOT NULL,
                     "garmentId" uuid,
                     CONSTRAINT "UQ_fdb24acf69b934be7f8648fad5b" UNIQUE ("imageUrl"),
                     CONSTRAINT "PK_7865d2999592ad1780ade713b95" PRIMARY KEY ("id")
                 )`,
        );
        await queryRunner.query(
            `CREATE TABLE "garment"
                 (
                     "id"            uuid DEFAULT uuid_generate_v4(),
                     "title"         character varying NOT NULL,
                     "description"   character varying NOT NULL,
                     "ownerId"       uuid,
                     "brandId"       uuid,
                     "categoryId"    uuid,
                     "subCategoryId" uuid,
                     CONSTRAINT "PK_9a36c35a6a4c8c0b2897743038b" PRIMARY KEY ("id")
                 )`,
        );
        await queryRunner.query(
            `CREATE TABLE "brand"
                 (
                     "id"   uuid DEFAULT uuid_generate_v4(),
                     "slug" character varying NOT NULL,
                     "name" character varying NOT NULL,
                     CONSTRAINT "UQ_f4436285f5d5785c7fb0b28b309" UNIQUE ("slug"),
                     CONSTRAINT "UQ_5f468ae5696f07da025138e38f7" UNIQUE ("name"),
                     CONSTRAINT "PK_a5d20765ddd942eb5de4eee2d7f" PRIMARY KEY ("id")
                 )`,
        );
        await queryRunner.query(
            `ALTER TABLE "garment_sub_category"
                    ADD CONSTRAINT "FK_a1332994c3c78f8f4523262ed81" FOREIGN KEY ("parentCategoryId") REFERENCES "garment_category" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "garment_image"
                    ADD CONSTRAINT "FK_712e642fcc7d0f5ad99fa9e051f" FOREIGN KEY ("garmentId") REFERENCES "garment" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "garment"
                    ADD CONSTRAINT "FK_355f460bed6868c605d35800655" FOREIGN KEY ("ownerId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "garment"
                    ADD CONSTRAINT "FK_10e2fee617e8a998c9f17c96c18" FOREIGN KEY ("brandId") REFERENCES "brand" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "garment"
                    ADD CONSTRAINT "FK_80d455d43d996bd3d48775259cc" FOREIGN KEY ("categoryId") REFERENCES "garment_category" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "garment"
                    ADD CONSTRAINT "FK_89a69f56380892f19e0ab528769" FOREIGN KEY ("subCategoryId") REFERENCES "garment_sub_category" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "garment"
            DROP CONSTRAINT "FK_89a69f56380892f19e0ab528769"`);
        await queryRunner.query(`ALTER TABLE "garment"
            DROP CONSTRAINT "FK_80d455d43d996bd3d48775259cc"`);
        await queryRunner.query(`ALTER TABLE "garment"
            DROP CONSTRAINT "FK_10e2fee617e8a998c9f17c96c18"`);
        await queryRunner.query(`ALTER TABLE "garment"
            DROP CONSTRAINT "FK_355f460bed6868c605d35800655"`);
        await queryRunner.query(`ALTER TABLE "garment_image"
            DROP CONSTRAINT "FK_712e642fcc7d0f5ad99fa9e051f"`);
        await queryRunner.query(`ALTER TABLE "garment_sub_category"
            DROP CONSTRAINT "FK_a1332994c3c78f8f4523262ed81"`);
        await queryRunner.query(`DROP TABLE "brand"`);
        await queryRunner.query(`DROP TABLE "garment"`);
        await queryRunner.query(`DROP TABLE "garment_image"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "garment_category"`);
        await queryRunner.query(`DROP TABLE "garment_sub_category"`);
    }
}
