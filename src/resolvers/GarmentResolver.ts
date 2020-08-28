import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';

import { Garment } from '../entities/Garment';
import { FallBackServerError, UnauthorizedError } from '../responses/errorResponses';
import {
    CreateGarmentResult,
    InvalidBrandError,
    InvalidColorError,
    InvalidGarmentError,
    InvalidOwnerError,
    InvalidSubcategoryError,
    UpdateGarmentResult,
} from '../responses/garmentResponses';
import { CreateGarmentInput } from '../inputs/CreateGarmentInput';
import { GarmentSubCategory } from '../entities/GarmentSubCategory';
import { Context } from '../index';
import { GarmentImage } from '../entities/GarmentImage';
import { Brand } from '../entities/Brand';
import { User } from '../entities/User';
import { Color } from '../entities/Color';
import { UpdateGarmentInput } from '../inputs/UpdateGarmentInput';

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
        @Arg('input') input: CreateGarmentInput,
        @Ctx() ctx: Context,
    ): Promise<typeof CreateGarmentResult> {
        try {
            const { subCategoryId, title, description, ownerId, imageUrls, brandId, colorId } = input;
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

            const garment = this.garmentRepository.create({
                title,
                owner,
                description,
                brand,
                color,
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

    @Authorized('IS_LOGGED_IN')
    @Mutation(() => UpdateGarmentResult)
    async updateGarment(
        @Arg('garmentData') input: UpdateGarmentInput,
        @Ctx() ctx: Context,
    ): Promise<typeof UpdateGarmentResult> {
        try {
            const { garmentId, subCategoryId, title, description, brandId, colorId } = input;

            let subCategory;
            let category;
            let brand;
            let color;

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
            await garment.save();
            return garment;
        } catch (e) {
            return new FallBackServerError({ message: 'Failed to create user', reason: e.message });
        }
    }

    @Query(() => Garment)
    async getGarmentById(@Arg('garmentId') garmentId: string): Promise<Garment | undefined> {
        return this.garmentRepository.findOne(garmentId, {
            relations: ['owner', 'brand', 'category', 'subCategory', 'images', 'color'],
        });
    }
}
