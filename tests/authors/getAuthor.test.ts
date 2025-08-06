import {INT_32, validationMessages} from "../../src/constants";
import {AuthorsApiSteps} from "../../src/steps/authorsApiSteps";
import {BooksApiSteps} from "../../src/steps/booksApiSteps";
import {generateAuthorRequest} from "../../src/utils/generators";

const booksSteps = new BooksApiSteps();
const authorSteps = new AuthorsApiSteps();

describe("GET /api/v1/Authors/{id}", () => {
    test("Information of the author can be retrieved successfully after author is added", async () => {
        const idBook = await booksSteps.getExistingBookOrAddNewOne();
        const request = generateAuthorRequest({idBook});
        const expectedResponse = {
            ...request, id: expect.toBePositive()
        };
        const response = await authorSteps.addAuthorAndValidate(request, expectedResponse);
        await authorSteps.getAuthorAndValidate(response);
    });

    test("Validation error should appear when getting a non-existing author", async () => {
        await authorSteps.getAuthorAndValidate({id: 0}, 404); //assume that 0 is not a valid id to store
    });

    test("Validation error should appear when getting an author with invalid id", async () => {
        await authorSteps.getAuthorAndValidate({id: INT_32 + 1}, 400, validationMessages.VALUE_NOT_VALID(INT_32 + 1));
    });
});