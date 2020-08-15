import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedCategoriesAndSubcategories1592771233735 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
                    insert into garment_category (slug, name)
                    VALUES ('tops', 'tops'),
                           ('bottoms', 'bottoms'),
                           ('outerwear', 'outerwear'),
                           ('footwear', 'footwear'),
                           ('accessories', 'accessories'),
                           ('tailoring', 'tailoring');


                    WITH cc AS (
                        SELECT id as tops_id
                        FROM garment_category
                        WHERE slug = 'tops'
                    )
                    insert
                    into garment_sub_category ("parentCategoryId", slug, name)
                    values ((select tops_id from cc), 'long-sleeve-shirts', 'Long Sleeve T-Shirts'),
                           ((select tops_id from cc), 'polos', 'Polos'),
                           ((select tops_id from cc), 'button_ups', 'Shirts (Button Ups)'),
                           ((select tops_id from cc), 'short_sleeve_shirts', 'Short Sleeve T-Shirts'),
                           ((select tops_id from cc), 'sweaters_knitwear', 'Sweaters & Knitwear'),
                           ((select tops_id from cc), 'sweatshirts_hoodies', 'Sweatshirts & Hoodies'),
                           ((select tops_id from cc), 'sleeveless', 'Tank Tops & Sleeveless'),
                           ((select tops_id from cc), 'jerseys', 'Jerseys');


                    WITH cc AS (
                        SELECT id as bottoms_id
                        FROM garment_category
                        WHERE slug = 'bottoms'
                    )
                    insert
                    into garment_sub_category ("parentCategoryId", slug, name)
                    values ((select bottoms_id from cc), 'casual-pants', 'Casual Pants'),
                           ((select bottoms_id from cc), 'cropped-pants', 'Cropped Pants'),
                           ((select bottoms_id from cc), 'denim', 'Denim'),
                           ((select bottoms_id from cc), 'leggings', 'Leggings'),
                           ((select bottoms_id from cc), 'jumpsuits', 'Overalls & Jumpsuits'),
                           ((select bottoms_id from cc), 'shorts', 'Shorts'),
                           ((select bottoms_id from cc), 'sweatpants-joggers', 'Sweatpants & Joggers'),
                           ((select bottoms_id from cc), 'swimwear', 'Swimwear');

                    WITH cc AS (
                        SELECT id as outerwear_id
                        FROM garment_category
                        WHERE slug = 'outerwear'
                    )
                    insert
                    into garment_sub_category ("parentCategoryId", slug, name)
                    values ((select outerwear_id from cc), 'bombers', 'Bombers'),
                           ((select outerwear_id from cc), 'cloaks-capes', 'Cloaks & Capes'),
                           ((select outerwear_id from cc), 'denim-jackets', 'Denim Jackets'),
                           ((select outerwear_id from cc), 'heavy-coats', 'Heavy Coats'),
                           ((select outerwear_id from cc), 'leather-jackets', 'Leather Jackets'),
                           ((select outerwear_id from cc), 'light-jackets', 'Light Jackets'),
                           ((select outerwear_id from cc), 'parkas', 'Parkas'),
                           ((select outerwear_id from cc), 'raincoats', 'Raincoats'),
                           ((select outerwear_id from cc), 'vests', 'Vests');

                    WITH cc AS (
                        SELECT id as footwear_id
                        FROM garment_category
                        WHERE slug = 'footwear'
                    )
                    insert
                    into garment_sub_category ("parentCategoryId", slug, name)
                    values ((select footwear_id from cc), 'boots', 'Boots'),
                           ((select footwear_id from cc), 'leather', 'Casual Leather Shoes'),
                           ((select footwear_id from cc), 'formal-shoes', 'Formal Shoes'),
                           ((select footwear_id from cc), 'hitop-sneakers', 'Hi-Top Sneakers'),
                           ((select footwear_id from cc), 'lowtop-sneakers', 'Low-Top Sneakers'),
                           ((select footwear_id from cc), 'sandals', 'Sandals'),
                           ((select footwear_id from cc), 'slip_ons', 'Slip Ons');

                    WITH cc AS (
                        SELECT id as tailoring_id
                        FROM garment_category
                        WHERE slug = 'tailoring'
                    )
                    insert
                    into garment_sub_category ("parentCategoryId", slug, name)
                    values ((select tailoring_id from cc), 'blazers', 'Blazers'),
                           ((select tailoring_id from cc), 'formal-shirting', 'Formal Shirting'),
                           ((select tailoring_id from cc), 'formal-trousers', 'Formal Trousers'),
                           ((select tailoring_id from cc), 'suits', 'Suits'),
                           ((select tailoring_id from cc), 'tuxedos', 'Tuxedos'),
                           ((select tailoring_id from cc), 'vests', 'Vests');

                    WITH cc AS (
                        SELECT id as accessories_id
                        FROM garment_category
                        WHERE slug = 'accessories'
                    )
                    insert
                    into garment_sub_category ("parentCategoryId", slug, name)
                    values ((select accessories_id from cc), 'bags-luggage', 'Bags & Luggage'),
                           ((select accessories_id from cc), 'belts', 'Belts'),
                           ((select accessories_id from cc), 'glasses', 'Glasses'),
                           ((select accessories_id from cc), 'gloves-scarves', 'Gloves & Scarves'),
                           ((select accessories_id from cc), 'hats', 'Hats'),
                           ((select accessories_id from cc), 'jewelry-watches', 'Jewelry & Watches'),
                           ((select accessories_id from cc), 'wallets', 'Wallets'),
                           ((select accessories_id from cc), 'misc', 'Miscellaneous'),
                           ((select accessories_id from cc), 'periodicals', 'Periodicals'),
                           ((select accessories_id from cc), 'socks-underwear', 'Socks & Underwear'),
                           ((select accessories_id from cc), 'sunglasses', 'Sunglasses'),
                           ((select accessories_id from cc), 'supreme', 'Supreme'),
                           ((select accessories_id from cc), 'ties-pocketsquares', 'Ties & Pocketsquares');
            `,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`TRUNCATE TABLE garment_sub_category CASCADE`);
        await queryRunner.query(`TRUNCATE TABLE garment_category CASCADE`);
    }
}
