import { PrimaryGeneratedColumn, Column, Entity, BaseEntity, BeforeInsert, BeforeUpdate, ManyToOne } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

import { GarmentCategory } from './GarmentCategory';
import { GarmentSubCategory } from './GarmentSubCategory';
import { User } from './User';

@ObjectType()
@Entity()
export class Garment extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Field()
    @Column()
    brand: string;

    @Field({ nullable: true })
    @Column({
        nullable: true,
        name: 'last_name',
    })
    lastName?: string;

    @Column({
        select: false,
    })
    password: string;

    @Field(() => User)
    @ManyToOne(() => User, (user: User) => user.garments)
    owner: User;

    @Field(() => GarmentCategory)
    @ManyToOne(() => GarmentCategory, (garmentCategory: GarmentCategory) => garmentCategory.garments)
    category: GarmentCategory;

    @Field(() => GarmentSubCategory)
    @ManyToOne(() => GarmentSubCategory, (garmentSubCategory: GarmentSubCategory) => garmentSubCategory.garments)
    subCategory: GarmentSubCategory;
}
