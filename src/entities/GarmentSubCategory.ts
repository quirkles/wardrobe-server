import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { GarmentCategory } from './GarmentCategory';
import { Garment } from './Garment';

@ObjectType()
@Entity()
@Unique('UQ_SLUG_CATEGORY', ['slug', 'parentCategory'])
@Unique('UQ_NAME_CATEGORY', ['name', 'parentCategory'])
export class GarmentSubCategory extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    readonly id: string;

    @Field()
    @Column()
    slug: string;

    @Field()
    @Column()
    name: string;

    @Field(() => GarmentCategory)
    @ManyToOne(() => GarmentCategory, (garmentCategory: GarmentCategory) => garmentCategory.subCategories)
    parentCategory: GarmentCategory;

    @Field(() => [Garment])
    @OneToMany(() => Garment, (garment: Garment) => garment.subCategory)
    garments: Garment[];
}
