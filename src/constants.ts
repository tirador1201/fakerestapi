export const INT_32 = 2147483647;

export const headers = {
    APPLICATION_JSON: 'application/*+json; v=1.0'
}

export enum statusText {
    BAD_REQUEST = 'Bad Request',
    UNSUPPORTED_MEDIA_TYPE = 'Unsupported Media Type',
    OK = 'OK',
    NOT_FOUND = 'Not Found'
}

export const statusTextCode: Map<number, statusText> = new Map([
    [400, statusText.BAD_REQUEST],
    [404, statusText.NOT_FOUND],
    [415, statusText.UNSUPPORTED_MEDIA_TYPE],
    [200, statusText.OK],

])

export const validationMessages = {
    NON_EMPTY_BODY_REQUIRED: 'A non-empty request body is required.',
    INVALID_ARGUMENT_FORMAT: 'Format of one of the request parameter is incorrect', //example of what it could be
    VALUE_NOT_VALID: (value: number | string): string => {return `The value '${value}' is not valid.`},
}

export const statusFunction = function (status: number) {
    return status < 500;
}

export type objectWithId = object & {id: number};