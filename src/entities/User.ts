import { PrimaryGeneratedColumn, Column, Entity, BaseEntity, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

import { encrypt } from '../encrypt';
import { Garment } from './Garment';

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    readonly id: string;

    @Field()
    @Column({
        unique: true,
    })
    email: string;

    @Field({ nullable: true })
    @Column({
        name: 'first_name',
        nullable: true,
    })
    firstName?: string;

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

    @Field(() => [Garment])
    @OneToMany(() => Garment, (garment: Garment) => garment.owner)
    garments: Garment[];

    @BeforeInsert()
    @BeforeUpdate()
    hashPassword(): void {
        if (this.password) {
            this.password = encrypt(this.password);
        }
    }
}
