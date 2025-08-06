import {headers, INT_32, objectWithId, validationMessages} from "../../src/constants";
import {BooksApiSteps} from "../../src/steps/booksApiSteps";
import {generateBookRequest, generateDefaultBookResponse} from "../../src/utils/generators";

const steps = new BooksApiSteps();

describe("PUT /api/v1/Books/{id}", () => {
    let data: objectWithId;
    beforeEach(async () => {
        const postRequest = generateBookRequest({});
        const postResponse = {
            ...postRequest, id: expect.toBePositive()
        };
        data = await steps.addBookAndValidate(postRequest, postResponse);
    })

    test("A book with all parameters should be updated successfully", async () => {
        const updateRequest = generateBookRequest({id: data.id});
        const updateResponse = updateRequest;
        await steps.updateBookAndValidate(updateRequest.id, updateRequest, updateResponse);
        await steps.getBookAndValidate(updateResponse);
    });

    test("A book should be updated successfully when request contains no parameters", async () => {
        const expectedResponse = {...generateDefaultBookResponse(), id: data.id}
        await steps.updateBookAndValidate(data.id, {}, expectedResponse);
        await steps.getBookAndValidate(data);
    });

    test("Updating a book twice with the same data shouldn't change response", async () => {
        const updateRequest = generateBookRequest({id: data.id});
        const updateResponse = updateRequest;
        await steps.updateBookAndValidate(updateRequest.id, updateRequest, updateResponse);
        await steps.updateBookAndValidate(updateRequest.id, updateRequest, updateResponse);
        await steps.getBookAndValidate(updateResponse);
    });

    test("A book should be updated successfully if id in the request differs from the url one", async () => {
        const updateRequest = generateBookRequest({id: 0});
        const updateResponse = {...updateRequest, id: data.id};
        await steps.updateBookAndValidate(data.id, updateRequest, updateResponse);
        await steps.getBookAndValidate(updateResponse);
    });

    test("Validation error should appear when updating a book with no body but proper header", async () => {
        await steps.updateBookAndValidate(data.id,
            undefined as unknown as object, {}, {"Content-Type": headers.APPLICATION_JSON}, validationMessages.NON_EMPTY_BODY_REQUIRED, 400);
    });

    test("Validation error should appear when updating a book with invalid body", async () => {
        await steps.updateBookAndValidate(data.id, undefined as unknown as object, {}, {}, '', 415);
    });

    test("Validation error should appear when updating a book with invalid url id", async () => {
        await steps.updateBookAndValidate("xyz" as unknown as number, {}, {}, {}, validationMessages.VALUE_NOT_VALID('xyz'), 400);
    });

    test("Validation error should appear when updating a book with non-existing id", async () => {
        await steps.updateBookAndValidate(0, {}, {}, {}, '', 400);
    });

    test.each([
        {id: "xyz" as unknown as number},
        {title: 123 as unknown as string},
        {description: 123 as unknown as string},
        {pageCount: "xyz" as unknown as number},
        {excerpt: 123 as unknown as string},
        {publishDate: 123 as unknown as string},
    ])("Validation error should appear when updating a book with incorrect type: %o of the request parameters", async (requestData) => {
        const request = generateBookRequest(requestData);
        await steps.updateBookAndValidate(data.id, request, {}, {}, validationMessages.INVALID_ARGUMENT_FORMAT, 400);
    });

    test.each([
        {id: INT_32 + 1},
        {pageCount: INT_32 + 1}
    ])("Validation error should appear when updating a book with invalid length: %o of the request parameters", async (requestData) => {
        const request = generateBookRequest(requestData);
        await steps.updateBookAndValidate(data.id, request, {}, {}, validationMessages.INVALID_ARGUMENT_FORMAT, 400);
    });
});