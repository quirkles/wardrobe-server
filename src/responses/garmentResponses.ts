import { createUnionType, Field, ObjectType } from 'type-graphql';
import { BaseError, ErrorSource, FallBackServerError, UnauthorizedError } from './errorResponses';
import { Garment } from '../entities/Garment';

@ObjectType()
export class InvalidSubcategoryError implements BaseError {
    @Field(() => String)
    readonly responseType = 'InvalidSubcategoryError';

    @Field(() => ErrorSource)
    readonly type: ErrorSource = ErrorSource.ClientError;

    @Field(() => String)
    readonly reason = 'No subcategory found with that id';
}

@ObjectType()
export class InvalidBrandError implements BaseError {
    @Field(() => String)
    readonly responseType = 'InvalidBrandError';

    @Field(() => ErrorSource)
    readonly type: ErrorSource = ErrorSource.ClientError;

    @Field(() => String)
    readonly reason = 'No brand found with that id';
}

@ObjectType()
export class InvalidOwnerError implements BaseError {
    @Field(() => String)
    readonly responseType = 'InvalidOwnerError';

    @Field(() => ErrorSource)
    readonly type: ErrorSource = ErrorSource.ClientError;

    @Field(() => String)
    readonly reason = 'No user found with that id';
}

export const CreateGarmentResult = createUnionType({
    name: 'CreateGarmentResult',
    types: () => [Garment, InvalidSubcategoryError, InvalidBrandError, InvalidOwnerError, UnauthorizedError, FallBackServerError] as const,
    resolveType: (value) => {
        if ('id' in value) {
            return 'Garment';
        }
        return value.responseType;
    },
});
