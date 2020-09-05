import { InputType, Field } from 'type-graphql';

@InputType()
export class CreateGarmentImageInput {
    @Field({ nullable: true })
    garmentId: string;

    @Field()
    imageName: string;

    @Field()
    imageUrl: string;
}
