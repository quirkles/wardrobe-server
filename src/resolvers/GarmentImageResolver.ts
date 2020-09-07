import { Resolver, Arg, Mutation, Authorized } from 'type-graphql';

import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';
import { Service } from 'typedi';
import { GarmentImage } from '../entities/GarmentImage';
import { CreateGarmentImageInput } from '../inputs/CreateGarmentImageInput';
import { CreateGarmentImageResult } from '../responses/garmentImageResponses';
import { Garment } from '../entities/Garment';
import { FallBackServerError } from '../responses/errorResponses';
import { InvalidGarmentError } from '../responses/invalidRelationResponses';

@Resolver()
@Service()
export class GarmentImageResolver {
    constructor(
        @InjectRepository(GarmentImage) private readonly garmentImageRepository: Repository<GarmentImage>,
        @InjectRepository(Garment) private readonly garmentRepository: Repository<Garment>,
    ) {}

    @Authorized('IS_LOGGED_IN')
    @Mutation(() => CreateGarmentImageResult)
    async createGarmentImage(
        @Arg('garmentImageData') garmentImageData: CreateGarmentImageInput,
    ): Promise<typeof CreateGarmentImageResult> {
        try {
            const { garmentId, ...imageData } = garmentImageData;
            const garmentImage = this.garmentImageRepository.create({
                name: imageData.imageName,
                url: imageData.imageUrl,
            });
            if (garmentId) {
                const garment = await this.garmentRepository.findOne(garmentId);
                if (!garment) {
                    return new InvalidGarmentError();
                }
                garmentImage.garment = garment;
            }
            await garmentImage.save();
            return garmentImage;
        } catch (e) {
            console.log(e) //eslint-disable-line
            return new FallBackServerError({ message: 'Failed to create garment image', reason: e.message });
        }
    }
}
