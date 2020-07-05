import { Resolver, Mutation, Arg, Query } from 'type-graphql';

import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';
import { Service } from 'typedi';
import { Brand } from '../entities/Brand';

@Resolver()
@Service()
export class BrandResolver {
    constructor(@InjectRepository(Brand) private readonly brandRepository: Repository<Brand>) {}

    @Query(() => [Brand])
    async getBrands(): Promise<Brand[]> {
        const brands = await this.brandRepository.find();
        return brands || [];
    }
}
