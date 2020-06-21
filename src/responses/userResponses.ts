import { User } from '../entities/User';
import { createUnionType, Field, ObjectType } from 'type-graphql';
import { BaseError, FallBackServerError, ErrorSource } from './errorResponses';

@ObjectType()
export class UserNotFoundError implements BaseError {
    @Field(() => String)
    readonly responseType = 'UserNotFound';

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

export const CreateUserResult = createUnionType({
    name: 'CreateUserResult',
    types: () => [User, DuplicateUserError, FallBackServerError] as const,
    resolveType: (value) => {
        if ('id' in value) {
            return 'User';
        }
        return value.responseType;
    },
});

export const LoginUserResult = createUnionType({
    name: 'LoginUserResult',
    types: () => [User, UserNotFoundError, FallBackServerError] as const,
    resolveType: (value) => {
        if ('id' in value) {
            return 'User';
        }
        return value.responseType;
    },
});
