import { Field, ObjectType, registerEnumType } from 'type-graphql';
import { TypeInfo } from 'graphql';

export enum ErrorSource {
    ServerError = 'ServerError',
    ClientError = 'ClientError',
}

registerEnumType(ErrorSource, {
    name: 'ErrorSource', // this one is mandatory
    description: 'Either client or server', // this one is optional
});

interface GenericError {
    message?: string;
    reason: string;
    type: ErrorSource;
}

export interface WithResponseType {
    readonly responseType: string;
}

interface ErrorProps {
    reason?: string;
    message?: string;
}

const GENERIC_ERROR_TYPE = 'GenericError';

export interface BaseError extends WithResponseType, GenericError {
    readonly responseType: string;

    readonly type: ErrorSource;

    readonly message?: string;

    readonly reason: string;
}

@ObjectType()
export class FallBackClientError implements BaseError {
    @Field()
    readonly responseType: string = 'FallBackClientError';

    @Field()
    readonly type: ErrorSource = ErrorSource.ClientError;

    @Field()
    readonly reason: string = 'Unidentifiable Client Error';

    @Field()
    readonly message: string = 'Could not complete action due to client error';
}

@ObjectType()
export class FallBackServerError implements BaseError {
    @Field()
    readonly responseType: string = 'FallBackServerError';

    @Field()
    readonly type: ErrorSource = ErrorSource.ServerError;

    @Field()
    readonly reason: string = 'Unidentifiable Server Error';

    @Field()
    readonly message: string = 'Could not complete action due to server error';

    constructor({ reason, message }: ErrorProps) {
        this.reason = reason || this.reason;
        this.message = message || this.message;
    }
}
