import { InputType, Field } from 'type-graphql';

@InputType()
export class UpdateGarmentInput {
    @Field()
    garmentId: string;

    @Field({ nullable: true })
    title: string;

    @Field({ nullable: true })
    description: string;

    @Field({ nullable: true })
    brandId: string;

    @Field({ nullable: true })
    colorId: string;

    @Field({ nullable: true })
    subCategoryId: string;

    @Field(() => [String], { nullable: true })
    imageUrls: string[];
}
