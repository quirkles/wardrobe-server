import {
    PrimaryGeneratedColumn,
    Column,
    Entity,
    BaseEntity,
    BeforeInsert,
    BeforeUpdate,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

import { GarmentCategory } from './GarmentCategory';
import { GarmentSubCategory } from './GarmentSubCategory';
import { User } from './User';
import { GarmentImage } from './GarmentImage';
import { Brand } from './Brand';

@ObjectType()
@Entity()
export class Garment extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Field()
    @Column()
    title: string;

    @Field()
    @Column()
    description: string;

    @Field(() => User)
    @ManyToOne(() => User, (user: User) => user.garments)
    owner: User;

    @Field(() => Brand)
    @ManyToOne(() => Brand, (brand: Brand) => brand.garments)
    brand: Brand;

    @Field(() => GarmentCategory)
    @ManyToOne(() => GarmentCategory, (garmentCategory: GarmentCategory) => garmentCategory.garments)
    category: GarmentCategory;

    @Field(() => GarmentSubCategory)
    @ManyToOne(() => GarmentSubCategory, (garmentSubCategory: GarmentSubCategory) => garmentSubCategory.garments)
    subCategory: GarmentSubCategory;

    @Field(() => [GarmentImage])
    @OneToMany(() => GarmentImage, (garmentImage: GarmentImage) => garmentImage.garment)
    images: GarmentImage[];
}
