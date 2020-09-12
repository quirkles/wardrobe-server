import { UserResolver } from '../resolvers/UserResolver';
import { GarmentResolver } from '../resolvers/GarmentResolver';
import { GarmentImageResolver } from '../resolvers/GarmentImageResolver';
import { CategoryResolver } from '../resolvers/CategoryResolver';
import { BrandResolver } from '../resolvers/BrandResolver';
import { ColorResolver } from '../resolvers/ColorResolver';

const resolvers = [UserResolver, GarmentResolver, GarmentImageResolver, BrandResolver, ColorResolver, CategoryResolver];

export default resolvers;
