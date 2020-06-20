import { PrimaryGeneratedColumn, Column, Entity, BaseEntity, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

import { encrypt } from '../encrypt';

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    readonly id: number;

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

    @BeforeInsert()
    @BeforeUpdate()
    hashPassword(): void {
        if (this.password) {
            this.password = encrypt(this.password);
        }
    }
}
