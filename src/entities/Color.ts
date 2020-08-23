import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Garment } from './Garment';

@ObjectType()
@Entity()
export class Color extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    readonly id: string;

    @Field()
    @Column({ unique: true })
    slug: string;

    @Field()
    @Column({ unique: true })
    name: string;

    @Field(() => [Garment])
    @OneToMany(() => Garment, (garment: Garment) => garment.color)
    garments: Garment[];
}
