import { Field, ObjectType } from 'type-graphql';
import { BaseError, ErrorSource } from './errorResponses';

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
export class InvalidGarmentError implements BaseError {
    @Field(() => String)
    readonly responseType = 'InvalidGarmentError';

    @Field(() => ErrorSource)
    readonly type: ErrorSource = ErrorSource.ClientError;

    @Field(() => String)
    readonly reason = 'No garment found with that id';
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
export class InvalidColorError implements BaseError {
    @Field(() => String)
    readonly responseType = 'InvalidColorError';

    @Field(() => ErrorSource)
    readonly type: ErrorSource = ErrorSource.ClientError;

    @Field(() => String)
    readonly reason = 'No color found with that id';
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
