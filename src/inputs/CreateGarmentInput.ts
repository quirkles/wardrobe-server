import { InputType, Field } from 'type-graphql';

@InputType()
export class CreateGarmentInput {
    @Field()
    ownerId: string;

    @Field()
    title: string;

    @Field()
    description: string;

    @Field()
    brandId: string;

    @Field()
    colorId: string;

    @Field()
    subCategoryId: string;

    @Field(() => [String], { nullable: true })
    garmentImageIds?: string[];
}
