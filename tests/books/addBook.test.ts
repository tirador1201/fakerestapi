import {headers, INT_32, validationMessages} from "../../src/constants";
import {BooksApiSteps} from "../../src/steps/booksApiSteps";
import {generateBookRequest, generateDefaultBookResponse} from "../../src/utils/generators";

const steps = new BooksApiSteps();

describe("POST /api/v1/Books", () => {
    test("A book with all parameters should be added successfully", async () => {
        const request = generateBookRequest({});
        const expectedResponse = {
            ...request, id: expect.toBePositive()
        };
        const response = await steps.addBookAndValidate(request, expectedResponse);
        await steps.getBookAndValidate(response);
    });

    test("A book should be added successfully when request contains no parameters", async () => {
        const expectedResponse = {...generateDefaultBookResponse(), id: expect.toBePositive()}
        const response = await steps.addBookAndValidate({}, expectedResponse);
        await steps.getBookAndValidate(response);
    });

    test("Two books with the same request data should be added successfully", async () => {
        const request = generateBookRequest({});
        const expectedResponse = {
            ...request, id: expect.toBePositive()
        };
        let response = await steps.addBookAndValidate(request, expectedResponse);
        await steps.getBookAndValidate(response);
        response = await steps.addBookAndValidate(request, expectedResponse);
        await steps.getBookAndValidate(response);
    });

    test("Validation error should appear when adding a book with no body but proper header", async () => {
        await steps.addBookAndValidate(
            undefined as unknown as object, {}, {"Content-Type": headers.APPLICATION_JSON}, validationMessages.NON_EMPTY_BODY_REQUIRED, 400);
    });

    test("Validation error should appear when adding a book with invalid body", async () => {
        await steps.addBookAndValidate(undefined as unknown as object, {}, {}, '', 415);
    });

    test.each([
        {id: "xyz" as unknown as number},
        {title: 123 as unknown as string},
        {description: 123 as unknown as string},
        {pageCount: "xyz" as unknown as number},
        {excerpt: 123 as unknown as string},
        {publishDate: 123 as unknown as string},
    ])("Validation error should appear when adding a book with incorrect type: %o of the request parameters", async (requestData) => {
        const request = generateBookRequest(requestData);
        await steps.addBookAndValidate(request, {}, {}, validationMessages.INVALID_ARGUMENT_FORMAT, 400);
    });

    test.each([
        {id: INT_32 + 1},
        {pageCount: INT_32 + 1}
    ])("Validation error should appear when adding a book with invalid length: %o of the request parameters", async (requestData) => {
        const request = generateBookRequest(requestData);
        await steps.addBookAndValidate(request, {}, {}, validationMessages.INVALID_ARGUMENT_FORMAT, 400);
    });
});