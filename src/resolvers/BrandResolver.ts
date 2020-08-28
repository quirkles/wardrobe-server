import { Resolver, Arg, Query } from 'type-graphql';

import { InjectRepository } from 'typeorm-typedi-extensions';
import { Like, Repository } from 'typeorm';
import { Service } from 'typedi';
import { Brand } from '../entities/Brand';

@Resolver()
@Service()
export class BrandResolver {
    constructor(@InjectRepository(Brand) private readonly brandRepository: Repository<Brand>) {}

    @Query(() => [Brand])
    async getBrands(@Arg('query') query: string): Promise<Brand[]> {
        const brands = await this.brandRepository.find({
            where: { slug: Like(`%${query.toLowerCase().replace(/ +/g, '-')}%`) },
        });
        return brands || [];
    }
}
