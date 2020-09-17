import { Resolver, Query } from 'type-graphql';

import { Service } from 'typedi';

@Resolver()
@Service()
export class HealthCheckResolver {
    @Query(() => String)
    healthCheck(): string {
        return 'server up!';
    }
}
