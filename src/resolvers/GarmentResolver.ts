import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';

import { Garment } from '../entities/Garment';
import { FallBackServerError, UnauthorizedError } from '../responses/errorResponses';
import {
    CreateGarmentResult,
    InvalidBrandError,
    InvalidOwnerError,
    InvalidSubcategoryError,
} from '../responses/garmentResponses';
import { CreateGarmentInput } from '../inputs/CreateGarmentInput';
import { GarmentSubCategory } from '../entities/GarmentSubCategory';
import { Context } from '../index';
import { GarmentImage } from '../entities/GarmentImage';
import { Brand } from '../entities/Brand';
import { User } from '../entities/User';

@Resolver()
@Service()
export class GarmentResolver {
    constructor(
        @InjectRepository(Garment)
        private readonly garmentRepository: Repository<Garment>,
        @InjectRepository(GarmentSubCategory)
        private readonly garmentSubCategoryRepository: Repository<GarmentSubCategory>,
        @InjectRepository(GarmentImage)
        private readonly garmentImageRepository: Repository<GarmentImage>,
        @InjectRepository(Brand)
        private readonly brandRepository: Repository<Brand>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    @Authorized('IS_LOGGED_IN')
    @Mutation(() => CreateGarmentResult)
    async createGarment(
        @Arg('input') input: CreateGarmentInput,
        @Ctx() ctx: Context,
    ): Promise<typeof CreateGarmentResult> {
        try {
            const { subCategoryId, title, description, ownerId, imageUrls, brandId } = input;
            if (String(ctx.user?.id) !== String(ownerId)) {
                console.log('!!!') //eslint-disable-line
                console.log(ownerId) //eslint-disable-line
                console.log(ctx.user?.id) //eslint-disable-line
                return new UnauthorizedError({ message: 'Could not create garment' });
            }
            const owner = await this.userRepository.findOne(ownerId);
            if (!owner) {
                return new InvalidOwnerError();
            }
            const subCategory = await this.garmentSubCategoryRepository.findOne(subCategoryId, {
                relations: ['parentCategory'],
            });
            if (!subCategory) {
                return new InvalidSubcategoryError();
            }

            const brand = await this.brandRepository.findOne(brandId);
            if (!brand) {
                return new InvalidBrandError();
            }

            const garment = this.garmentRepository.create({
                title,
                owner,
                description,
                brand,
                category: subCategory.parentCategory,
                subCategory,
            });

            if (imageUrls && imageUrls.length) {
                const garmentImages: GarmentImage[] = imageUrls.map((imageUrl) =>
                    this.garmentImageRepository.create({ imageUrl }),
                );
                garment.images = garmentImages;
            }

            await garment.save();
            return garment;
        } catch (e) {
            return new FallBackServerError({ message: 'Failed to create user', reason: e.message });
        }
    }
}
