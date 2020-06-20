import { InputType, Field } from 'type-graphql';
import { User } from '../entities/User';

@InputType()
export class CreateUserInput implements Partial<User> {
    @Field()
    email: string;

    @Field()
    password: string;

    @Field({ nullable: true })
    firstName?: string;

    @Field({ nullable: true })
    lastName?: string;
}
