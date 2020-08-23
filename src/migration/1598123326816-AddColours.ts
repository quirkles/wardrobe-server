import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColours1598123326816 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "color"
                 (
                     "id"               uuid DEFAULT uuid_generate_v4(),
                     "slug"             character varying NOT NULL,
                     "name"             character varying NOT NULL,
                     CONSTRAINT "PK_color_id" PRIMARY KEY ("id")

             )`,
        );
        await queryRunner.query(`ALTER TABLE "garment" ADD COLUMN "colorId" uuid;`);
        await queryRunner.query(
            `ALTER TABLE "garment"
                    ADD CONSTRAINT "FK_garment_color" FOREIGN KEY ("colorId") REFERENCES "color" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;`,
        );
        await queryRunner.query(`insert into color (name, slug)
        values ('Amaranth', 'amaranth'),
            ('Amber', 'amber'),
            ('Amethyst', 'amethyst'),
            ('Apricot', 'apricot'),
            ('Aquamarine', 'aquamarine'),
            ('Azure', 'azure'),
            ('Baby blue', 'baby-blue'),
            ('Beige', 'beige'),
            ('Black', 'black'),
            ('Blue', 'blue'),
            ('Blue-green', 'blue-green'),
            ('Blue-violet', 'blue-violet'),
            ('Blush', 'blush'),
            ('Brick Red', 'brick-red'),
            ('Bronze', 'bronze'),
            ('Brown', 'brown'),
            ('Burgundy', 'burgundy'),
            ('Byzantium', 'byzantium'),
            ('Carmine', 'carmine'),
            ('Cerise', 'cerise'),
            ('Cerulean', 'cerulean'),
            ('Champagne', 'champagne'),
            ('Chartreuse green', 'chartreuse-green'),
            ('Chocolate', 'chocolate'),
            ('Cobalt blue', 'cobalt-blue'),
            ('Coffee', 'coffee'),
            ('Copper', 'copper'),
            ('Coral', 'coral'),
            ('Crimson', 'crimson'),
            ('Cyan', 'cyan'),
            ('Desert sand', 'desert-sand'),
            ('Electric blue', 'electric-blue'),
            ('Emerald', 'emerald'),
            ('Erin', 'erin'),
            ('Gold', 'gold'),
            ('Gray', 'gray'),
            ('Green', 'green'),
            ('Harlequin', 'harlequin'),
            ('Indigo', 'indigo'),
            ('Ivory', 'ivory'),
            ('Jade', 'jade'),
            ('Jungle green', 'jungle-green'),
            ('Lavender', 'lavender'),
            ('Lemon', 'lemon'),
            ('Lilac', 'lilac'),
            ('Lime', 'lime'),
            ('Magenta', 'magenta'),
            ('Magenta rose', 'magenta-rose'),
            ('Maroon', 'maroon'),
            ('Mauve', 'mauve'),
            ('Navy blue', 'navy-blue'),
            ('Ochre', 'ochre'),
            ('Olive', 'olive'),
            ('Orange', 'orange'),
            ('Orange-red', 'orange-red'),
            ('Orchid', 'orchid'),
            ('Peach', 'peach'),
            ('Pear', 'pear'),
            ('Periwinkle', 'periwinkle'),
            ('Persian blue', 'persian-blue'),
            ('Pink', 'pink'),
            ('Plum', 'plum'),
            ('Prussian blue', 'prussian-blue'),
            ('Puce', 'puce'),
            ('Purple', 'purple'),
            ('Raspberry', 'raspberry'),
            ('Red', 'red'),
            ('Red-violet', 'red-violet'),
            ('Rose', 'rose'),
            ('Ruby', 'ruby'),
            ('Salmon', 'salmon'),
            ('Sangria', 'sangria'),
            ('Sapphire', 'sapphire'),
            ('Scarlet', 'scarlet'),
            ('Silver', 'silver'),
            ('Slate gray', 'slate-gray'),
            ('Spring bud', 'spring-bud'),
            ('Spring green', 'spring-green'),
            ('Tan', 'tan'),
            ('Taupe', 'taupe'),
            ('Teal', 'teal'),
            ('Turquoise', 'turquoise'),
            ('Ultramarine', 'ultramarine'),
            ('Violet', 'violet'),
            ('Viridian', 'viridian'),
            ('White', 'white'),
            ('Yellow', 'yellow');
            `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "color"`);

        await queryRunner.query(`ALTER TABLE "garment" DROP CONSTRAINT "FK_garment_color"`);
    }
}
