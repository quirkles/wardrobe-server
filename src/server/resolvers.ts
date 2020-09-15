import {
    UserResolver,
    GarmentResolver,
    GarmentImageResolver,
    CategoryResolver,
    BrandResolver,
    ColorResolver,
    HealthCheckResolver,
} from '../resolvers';

const resolvers = [UserResolver, GarmentResolver, GarmentImageResolver, BrandResolver, ColorResolver, CategoryResolver, HealthCheckResolver];

export default resolvers;
