import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GarmentSubCategory } from './GarmentSubCategory';
import { Garment } from './Garment';

@ObjectType()
@Entity()
export class GarmentCategory extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Field()
    @Column({
        unique: true,
    })
    slug: string;

    @Field()
    @Column({
        unique: true,
    })
    name: string;

    @Field(() => [GarmentSubCategory])
    @OneToMany(() => GarmentSubCategory, (garmentSubCategory: GarmentSubCategory) => garmentSubCategory.parentCategory)
    subCategories: GarmentSubCategory[];

    @Field(() => [Garment])
    @OneToMany(() => Garment, (garment: Garment) => garment.category)
    garments: Garment[];
}
