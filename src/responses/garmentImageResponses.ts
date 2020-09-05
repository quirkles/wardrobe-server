import { createUnionType } from 'type-graphql';
import { FallBackServerError, UnauthorizedError } from './errorResponses';
import { GarmentImage } from '../entities/GarmentImage';
import { InvalidGarmentError } from './invalidRelationResponses';

export const CreateGarmentImageResult = createUnionType({
    name: 'CreateGarmentImageResult',
    types: () => [GarmentImage, InvalidGarmentError, UnauthorizedError, FallBackServerError] as const,
    resolveType: (value) => {
        if ('id' in value) {
            return 'GarmentImage';
        }
        return value.responseType;
    },
});
