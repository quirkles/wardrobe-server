import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Garment } from './Garment';

@ObjectType()
@Entity()
export class GarmentImage extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    readonly id: string;

    @Field()
    @Column({
        unique: true,
    })
    imageUrl: string;

    @Field(() => Garment)
    @ManyToOne(() => Garment, (garment: Garment) => garment.images)
    garment: Garment;
}
