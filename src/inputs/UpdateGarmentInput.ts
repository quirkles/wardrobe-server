import { InputType, Field } from 'type-graphql';
import { CreateGarmentInput } from './CreateGarmentInput';

@InputType()
export class UpdateGarmentInput extends CreateGarmentInput {
    @Field()
    garmentId: string;
}
