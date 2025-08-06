import {headers, INT_32, validationMessages} from "../../src/constants";
import {AuthorsApiSteps} from "../../src/steps/authorsApiSteps";
import {BooksApiSteps} from "../../src/steps/booksApiSteps";
import {generateAuthorRequest, generateDefaultAuthorResponse} from "../../src/utils/generators";

const booksSteps = new BooksApiSteps();
const authorSteps = new AuthorsApiSteps();

describe("POST /api/v1/Authors", () => {
    let idBook: number;
    beforeEach(async () => {
        idBook = await booksSteps.getExistingBookOrAddNewOne();
    });

    test("An author with all parameters should be added successfully", async () => {
        const request = generateAuthorRequest({idBook});
        const expectedResponse = {
            ...request, id: expect.toBePositive()
        };
        const response = await authorSteps.addAuthorAndValidate(request, expectedResponse);
        await authorSteps.getAuthorAndValidate(response);
    });

    test("An author should be added successfully when request contains no parameters", async () => {
        const expectedResponse = {...generateDefaultAuthorResponse(), id: expect.toBePositive()}
        const response = await authorSteps.addAuthorAndValidate({}, expectedResponse);
        await authorSteps.getAuthorAndValidate(response);
    });

    test("Two author with the same request data should be added successfully", async () => {
        const request = generateAuthorRequest({idBook});
        const expectedResponse = {
            ...request, id: expect.toBePositive()
        };
        let response = await authorSteps.addAuthorAndValidate(request, expectedResponse);
        await authorSteps.getAuthorAndValidate(response);
        response = await authorSteps.addAuthorAndValidate(request, expectedResponse);
        await authorSteps.getAuthorAndValidate(response);
    });

    test("Validation error should appear when adding an author with no body but proper header", async () => {
        await authorSteps.addAuthorAndValidate(
            undefined as unknown as object, {}, {"Content-Type": headers.APPLICATION_JSON}, validationMessages.NON_EMPTY_BODY_REQUIRED, 400);
    });

    test("Validation error should appear when adding an author with invalid body", async () => {
        await authorSteps.addAuthorAndValidate(undefined as unknown as object, {}, {}, '', 415);
    });

    test("Validation error should appear when adding an author with incorrect book id", async () => {
        const request = generateAuthorRequest({idBook: 0});
        await authorSteps.addAuthorAndValidate(request, {}, {}, validationMessages.INVALID_ARGUMENT_FORMAT, 400);
    });

    test.each([
        {id: "xyz" as unknown as number},
        {idBook: "xyz" as unknown as number},
        {firstName: 123 as unknown as string},
        {lastName: 123 as unknown as string},
    ])("Validation error should appear when adding an author with incorrect type: %o of the request parameters", async (requestData) => {
        const request = generateAuthorRequest(requestData);
        await authorSteps.addAuthorAndValidate(request, {}, {}, validationMessages.INVALID_ARGUMENT_FORMAT, 400);
    });

    test.each([
        {id: INT_32 + 1},
        {idBook: INT_32 + 1}
    ])("Validation error should appear when adding an author with invalid length: %o of the request parameters", async (requestData) => {
        const request = generateAuthorRequest(requestData);
        await authorSteps.addAuthorAndValidate(request, {}, {}, validationMessages.INVALID_ARGUMENT_FORMAT, 400);
    });
});