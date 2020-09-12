import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { In, Repository } from 'typeorm';

import { Garment } from '../entities/Garment';
import { FallBackServerError, UnauthorizedError } from '../responses/errorResponses';
import { CreateGarmentInput } from '../inputs/CreateGarmentInput';
import { GarmentSubCategory } from '../entities/GarmentSubCategory';
import { GarmentImage } from '../entities/GarmentImage';
import { Brand } from '../entities/Brand';
import { User } from '../entities/User';
import { Color } from '../entities/Color';
import { UpdateGarmentInput } from '../inputs/UpdateGarmentInput';
import {
    CreateGarmentResult,
    GarmentNotFoundError,
    GarmentResult,
    UpdateGarmentResult,
} from '../responses/garmentResponses';
import {
    InvalidBrandError,
    InvalidColorError,
    InvalidGarmentError,
    InvalidOwnerError,
    InvalidSubcategoryError,
} from '../responses/invalidRelationResponses';
import { AppContext } from '../server/appContext';

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
        @InjectRepository(Color)
        private readonly colorRepository: Repository<Color>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    @Authorized('IS_LOGGED_IN')
    @Mutation(() => CreateGarmentResult)
    async createGarment(
        @Arg('garmentData') input: CreateGarmentInput,
        @Ctx() ctx: AppContext,
    ): Promise<typeof CreateGarmentResult> {
        try {
            const { subCategoryId, title, description, ownerId, garmentImageIds, brandId, colorId } = input;

            if (String(ctx.user?.id) !== String(ownerId)) {
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

            const color = await this.colorRepository.findOne(colorId);
            if (!color) {
                return new InvalidColorError();
            }

            let garmentImages = [] as GarmentImage[];
            if (garmentImageIds && garmentImageIds.length) {
                garmentImages = await this.garmentImageRepository.find({
                    id: In(garmentImageIds),
                });
            }

            const garment = this.garmentRepository.create({
                title,
                owner,
                description,
                brand,
                color,
                images: garmentImages,
                category: subCategory.parentCategory,
                subCategory,
            });

            await garment.save();
            return garment;
        } catch (error) {
            ctx.logger.warn({ error });
            return new FallBackServerError({ message: 'Failed to create garment', reason: error.message });
        }
    }

    @Authorized('IS_LOGGED_IN')
    @Mutation(() => UpdateGarmentResult)
    async updateGarment(
        @Arg('garmentData') input: UpdateGarmentInput,
        @Ctx() ctx: AppContext,
    ): Promise<typeof UpdateGarmentResult> {
        try {
            const { garmentId, subCategoryId, title, description, brandId, colorId, garmentImageIds } = input;

            let subCategory;
            let category;
            let brand;
            let color;
            let garmentImages;

            const garment = await this.garmentRepository.findOne(garmentId, {
                relations: ['owner'],
            });

            if (!garment) {
                return new InvalidGarmentError();
            }

            const { id: ownerId } = garment.owner;

            if (String(ctx.user?.id) !== String(ownerId)) {
                return new InvalidOwnerError();
            }

            if (subCategoryId) {
                subCategory = await this.garmentSubCategoryRepository.findOne(subCategoryId, {
                    relations: ['parentCategory'],
                });
                if (!subCategory) {
                    return new InvalidSubcategoryError();
                }
                category = subCategory?.parentCategory;
            }

            if (brandId) {
                brand = await this.brandRepository.findOne(brandId);
                if (!brand) {
                    return new InvalidBrandError();
                }
            }

            if (colorId) {
                color = await this.colorRepository.findOne(colorId);
                if (!color) {
                    return new InvalidColorError();
                }
            }

            if (garmentImageIds) {
                garmentImages = await this.garmentImageRepository.find({
                    id: In(garmentImageIds),
                });
            }

            if (title) {
                garment.title = title;
            }

            if (description) {
                garment.description = description;
            }

            if (subCategory && category) {
                garment.subCategory = subCategory;
                garment.category = category;
            }
            if (brand) {
                garment.brand = brand;
            }
            if (color) {
                garment.color = color;
            }
            if (garmentImages) {
                garment.images = garmentImages;
            }
            await garment.save();
            return garment;
        } catch (e) {
            ctx.logger.warn(e);
            return new FallBackServerError({ message: 'Failed to update garment', reason: e.message });
        }
    }

    @Query(() => GarmentResult)
    async getGarmentById(@Arg('garmentId') garmentId: string): Promise<typeof GarmentResult> {
        const garment = await this.garmentRepository.findOne(garmentId, {
            relations: ['owner', 'brand', 'category', 'subCategory', 'images', 'color'],
        });

        if (garment) {
            return garment;
        }
        return new GarmentNotFoundError(garmentId);
    }
}
