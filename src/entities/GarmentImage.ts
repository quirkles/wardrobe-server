import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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
    url: string;

    @Field()
    @Column()
    name: string;

    @Field(() => Garment, { nullable: true })
    @ManyToOne(() => Garment, (garment: Garment) => garment.images)
    garment?: Garment;
}
