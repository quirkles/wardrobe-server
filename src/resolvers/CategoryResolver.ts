import { Resolver, Query, Arg } from 'type-graphql';

import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';
import { Service } from 'typedi';
import { GarmentCategory } from '../entities/GarmentCategory';
import { Garment } from '../entities/Garment';

@Resolver()
@Service()
export class CategoryResolver {
    constructor(
        @InjectRepository(Garment) private readonly garmentRepository: Repository<Garment>,
        @InjectRepository(GarmentCategory) private readonly categoryRepository: Repository<GarmentCategory>,
    ) {}

    @Query(() => [GarmentCategory])
    async getCategories(): Promise<GarmentCategory[]> {
        const garmentCategories = await this.categoryRepository.find({
            relations: ['subCategories'],
        });
        return garmentCategories || [];
    }

    @Query(() => Garment)
    async getGarmentById(@Arg('garmentId') garmentId: string): Promise<Garment | undefined> {
        return this.garmentRepository.findOne(garmentId, {
            relations: ['owner', 'brand', 'category', 'subCategory', 'images'],
        });
    }
}
