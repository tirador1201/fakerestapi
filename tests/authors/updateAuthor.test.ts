import {headers, INT_32, objectWithId, validationMessages} from "../../src/constants";
import {AuthorsApiSteps} from "../../src/steps/authorsApiSteps";
import {BooksApiSteps} from "../../src/steps/booksApiSteps";
import {generateAuthorRequest, generateDefaultAuthorResponse, } from "../../src/utils/generators";

const booksSteps = new BooksApiSteps();
const authorSteps = new AuthorsApiSteps();

describe("PUT /api/v1/Authors/{id}", () => {
    let postResponse: objectWithId;

    beforeEach(async () => {
        const idBook = await booksSteps.getExistingBookOrAddNewOne();
        const request = generateAuthorRequest({idBook});
        const expectedPostResponse = {
            ...request, id: expect.toBePositive()
        };
        postResponse = await authorSteps.addAuthorAndValidate(request, expectedPostResponse);
    })

    test("An author with all parameters should be updated successfully", async () => {
        const updateRequest = generateAuthorRequest({id: postResponse.id});
        const updateExpectedResponse = updateRequest;
        await authorSteps.updateAuthorAndValidate(updateRequest.id, updateRequest, updateExpectedResponse);
        await authorSteps.getAuthorAndValidate(updateExpectedResponse);
    });

    test("An author should be updated successfully when request contains no parameters", async () => {
        const updateExpectedResponse = {...generateDefaultAuthorResponse(), id: postResponse.id, idBook: expect.toBePositive()};
        await authorSteps.updateAuthorAndValidate(postResponse.id, {}, updateExpectedResponse);
        await authorSteps.getAuthorAndValidate(postResponse);
    });

    test("Updating an author twice with the same data shouldn't change postResponse", async () => {
        const updateRequest = generateAuthorRequest({id: postResponse.id});
        const updateExpectedResponse = updateRequest;
        await authorSteps.updateAuthorAndValidate(updateRequest.id, updateRequest, updateExpectedResponse);
        await authorSteps.updateAuthorAndValidate(updateRequest.id, updateRequest, updateExpectedResponse);
        await authorSteps.getAuthorAndValidate(updateExpectedResponse);
    });

    test("An author should be updated successfully if id in the request differs from the url one", async () => {
        const updateRequest = generateAuthorRequest({id: 0});
        const updateExpectedResponse = {...updateRequest, id: postResponse.id};
        await authorSteps.updateAuthorAndValidate(postResponse.id, updateRequest, updateExpectedResponse);
        await authorSteps.getAuthorAndValidate(updateExpectedResponse);
    });

    test("Validation error should appear when updating an author with no body but proper header", async () => {
        await authorSteps.updateAuthorAndValidate(postResponse.id,
            undefined as unknown as object, {}, {"Content-Type": headers.APPLICATION_JSON}, validationMessages.NON_EMPTY_BODY_REQUIRED, 400);
    });

    test("Validation error should appear when updating an author with invalid body", async () => {
        await authorSteps.updateAuthorAndValidate(postResponse.id, undefined as unknown as object, {}, {}, '', 415);
    });

    test("Validation error should appear when adding an author with incorrect book id", async () => {
        const request = generateAuthorRequest({idBook: 0});
        await authorSteps.updateAuthorAndValidate(postResponse.id, request, {}, {}, validationMessages.INVALID_ARGUMENT_FORMAT, 400);
    });

    test("Validation error should appear when updating an author with invalid url id", async () => {
        await authorSteps.updateAuthorAndValidate("xyz" as unknown as number, {}, {}, {}, validationMessages.VALUE_NOT_VALID('xyz'), 400);
    });

    test("Validation error should appear when updating an author with non-existing id", async () => {
        await authorSteps.updateAuthorAndValidate(0, {}, {}, {}, '', 400); //consider 0 as incorrect (non-existing) id
    });

    test.each([
        {id: "xyz" as unknown as number},
        {idBook: "xyz" as unknown as number},
        {firstName: 123 as unknown as string},
        {lastName: 123 as unknown as string},
    ])("Validation error should appear when updating an author with incorrect type: %o of the request parameters", async (requestData) => {
        const request = generateAuthorRequest(requestData);
        await authorSteps.updateAuthorAndValidate(postResponse.id, request, {}, {}, validationMessages.INVALID_ARGUMENT_FORMAT, 400);
    });

    test.each([
        {id: INT_32 + 1},
        {idBook: INT_32 + 1}
    ])("Validation error should appear when updating an author with invalid length: %o of the request parameters", async (requestData) => {
        const request = generateAuthorRequest(requestData);
        await authorSteps.updateAuthorAndValidate(postResponse.id, request, {}, {}, validationMessages.INVALID_ARGUMENT_FORMAT, 400);
    });

});