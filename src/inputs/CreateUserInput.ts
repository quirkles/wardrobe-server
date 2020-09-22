import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { InputType, Field } from 'type-graphql';

import { User } from '../entities/User';

@InputType()
export class CreateUserInput implements Partial<User> {
    @Field()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @Field()
    @IsNotEmpty()
    password: string;

    @MinLength(4)
    @Field({ nullable: true })
    firstName?: string;

    @MinLength(4)
    @Field({ nullable: true })
    lastName?: string;
}
