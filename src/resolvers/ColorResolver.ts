import { Resolver, Arg, Query } from 'type-graphql';

import { InjectRepository } from 'typeorm-typedi-extensions';
import { Like, Repository } from 'typeorm';
import { Service } from 'typedi';
import { Color } from '../entities/Color';

@Resolver()
@Service()
export class ColorResolver {
    constructor(@InjectRepository(Color) private readonly ColorRepository: Repository<Color>) {}

    @Query(() => [Color])
    async getColors(@Arg('query') query: string): Promise<Color[]> {
        const likeQuery = Like(`%${query}%`);
        const Colors = await this.ColorRepository.find({
            where: [{ slug: likeQuery }, { name: likeQuery }],
        });
        return Colors || [];
    }
}
