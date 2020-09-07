import { Field, ObjectType, registerEnumType } from 'type-graphql';

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

export interface BaseError extends WithResponseType, GenericError {
    readonly responseType: string;

    readonly type: ErrorSource;

    readonly message?: string;

    readonly reason: string;
}

export abstract class EntityNotFoundError implements BaseError {
    @Field()
    readonly responseType: string = 'EntityNotFoundError';

    @Field()
    readonly type: ErrorSource = ErrorSource.ClientError;

    @Field()
    readonly reason: string = 'Requested entity not found';

    @Field()
    message: string;
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

@ObjectType()
export class UnauthorizedError implements BaseError {
    @Field()
    readonly responseType: string = 'UnauthorizedError';

    @Field()
    readonly type: ErrorSource = ErrorSource.ClientError;

    @Field()
    readonly reason: string = 'You are not authorized to perform this action';

    @Field()
    readonly message: string = 'Could not complete action';

    constructor({ reason, message }: ErrorProps) {
        this.reason = reason || this.reason;
        this.message = message || this.message;
    }
}
