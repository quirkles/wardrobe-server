import { Resolver, Mutation, Arg, Query } from 'type-graphql';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '../../config';

import { User } from '../entities/User';
import { CreateUserInput } from '../inputs/CreateUserInput';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';
import { encrypt } from '../encrypt';
import {
    CreateUserResult,
    DuplicateUserError,
    LoginUserResult,
    UserNotFoundError,
    GetUserByIdResult,
} from '../responses/userResponses';
import { FallBackServerError } from '../responses/errorResponses';
import { Service } from 'typedi';

@Resolver()
@Service()
export class UserResolver {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

    @Query(() => GetUserByIdResult)
    async getUserById(@Arg('userId') userId: string): Promise<typeof GetUserByIdResult> {
        const existingUser = await this.userRepository.findOne({
            relations: ['garments', 'garments.brand', 'garments.subCategory'],
            where: {
                id: userId,
            },
        });
        if (existingUser) {
            console.log(existingUser) //eslint-disable-line
            return existingUser;
        }
            console.log('not found ') //eslint-disable-line
        return new UserNotFoundError();
    }

    @Mutation(() => CreateUserResult)
    async createUser(@Arg('input') input: CreateUserInput): Promise<typeof CreateUserResult> {
        try {
            const existingUser = await this.userRepository.findOne({ email: input.email });
            if (existingUser) {
                return new DuplicateUserError();
            }
            const user = this.userRepository.create(input);
            await user.save();
            const { email, id } = user;
            const token = sign({ email, sub: id }, JWT_SECRET);
            return { user, token };
        } catch (e) {
            return new FallBackServerError({ message: 'Failed to create user', reason: e.message });
        }
    }

    @Mutation(() => LoginUserResult)
    async loginUser(@Arg('email') email: string, @Arg('password') password: string): Promise<typeof LoginUserResult> {
        const user = await this.userRepository.findOne({ email, password: encrypt(password) });
        if (user) {
            const { email, id } = user;
            const token = sign({ email, sub: id }, JWT_SECRET);
            return { user, token };
        }
        return new UserNotFoundError();
    }
}
