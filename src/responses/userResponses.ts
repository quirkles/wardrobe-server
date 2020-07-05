import { User } from '../entities/User';
import { createUnionType, Field, ObjectType } from 'type-graphql';
import { BaseError, FallBackServerError, ErrorSource } from './errorResponses';

@ObjectType()
export class UserNotFoundError implements BaseError {
    @Field(() => String)
    readonly responseType = 'UserNotFoundError';

    @Field(() => ErrorSource)
    readonly type: ErrorSource = ErrorSource.ClientError;

    @Field(() => String)
    readonly reason = 'No user found matching those credentials';
}

@ObjectType()
export class DuplicateUserError implements BaseError {
    @Field(() => String)
    readonly responseType = 'DuplicateUserError';

    @Field(() => ErrorSource)
    readonly type: ErrorSource = ErrorSource.ClientError;

    @Field(() => String)
    readonly reason = 'User with that email already exists';
}

@ObjectType()
export class UserAndToken {
    @Field(() => User)
    user: User;

    @Field(() => String)
    token: string;
}

export const CreateUserResult = createUnionType({
    name: 'CreateUserResult',
    types: () => [UserAndToken, DuplicateUserError, FallBackServerError] as const,
    resolveType: (value) => {
        if ('user' in value) {
            return 'UserAndToken';
        }
        return value.responseType;
    },
});

export const LoginUserResult = createUnionType({
    name: 'LoginUserResult',
    types: () => [UserAndToken, UserNotFoundError, FallBackServerError] as const,
    resolveType: (value) => {
        if ('user' in value) {
            return UserAndToken;
        }
        return value.responseType;
    },
});

export const GetUserByIdResult = createUnionType({
    name: 'GetUserByIdResult',
    types: () => [User, UserNotFoundError] as const,
    resolveType: (value) => {
        if ('id' in value) {
            return User;
        }
        return value.responseType;
    },
});
