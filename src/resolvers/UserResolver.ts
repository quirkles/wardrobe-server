import { Resolver, Mutation, Arg, Query } from 'type-graphql';
import { User } from '../entities/User';
import { CreateUserInput } from '../inputs/CreateUserInput';

@Resolver()
export class UserResolver {
    @Query(() => String)
    hello(): string {
        return 'world';
    }

    @Mutation(() => User)
    async createUser(@Arg('input') input: CreateUserInput): Promise<User> {
        const user = User.create(input);
        await user.save();
        return user;
    }
}
