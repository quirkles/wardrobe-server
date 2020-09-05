import { createUnionType, Field, ObjectType } from 'type-graphql';
import { EntityNotFoundError, ErrorSource, FallBackServerError, UnauthorizedError } from './errorResponses';
import { Garment } from '../entities/Garment';
import {
    InvalidBrandError,
    InvalidColorError,
    InvalidGarmentError,
    InvalidOwnerError,
    InvalidSubcategoryError,
} from './invalidRelationResponses';

@ObjectType()
export class GarmentNotFoundError extends EntityNotFoundError {
    @Field()
    readonly type: ErrorSource;

    @Field()
    readonly reason: string;

    @Field()
    message: string;

    @Field()
    readonly responseType: string = 'GarmentNotFoundError';

    constructor(garmentId: string) {
        super();
        this.message = `Could not locate garment with id: ${garmentId}`;
    }
}

export const CreateGarmentResult = createUnionType({
    name: 'CreateGarmentResult',
    types: () =>
        [
            Garment,
            InvalidSubcategoryError,
            InvalidBrandError,
            InvalidColorError,
            InvalidOwnerError,
            UnauthorizedError,
            FallBackServerError,
        ] as const,
    resolveType: (value) => {
        if ('id' in value) {
            return 'Garment';
        }
        return value.responseType;
    },
});

export const UpdateGarmentResult = createUnionType({
    name: 'UpdateGarmentResult',
    types: () =>
        [
            Garment,
            InvalidSubcategoryError,
            InvalidGarmentError,
            InvalidBrandError,
            InvalidColorError,
            InvalidOwnerError,
            UnauthorizedError,
            FallBackServerError,
        ] as const,
    resolveType: (value) => {
        if ('id' in value) {
            return 'Garment';
        }
        return value.responseType;
    },
});

export const GarmentResult = createUnionType({
    name: 'GarmentResult',
    types: () => [Garment, GarmentNotFoundError, FallBackServerError] as const,
    resolveType: (value) => {
        if ('id' in value) {
            return 'Garment';
        }
        return value.responseType;
    },
});
