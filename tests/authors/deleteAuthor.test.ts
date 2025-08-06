import {INT_32, validationMessages} from "../../src/constants";
import {AuthorsApiSteps} from "../../src/steps/authorsApiSteps";
import {BooksApiSteps} from "../../src/steps/booksApiSteps";
import {generateAuthorRequest} from "../../src/utils/generators";

const booksSteps = new BooksApiSteps();
const authorSteps = new AuthorsApiSteps();

describe("DELETE /api/v1/Authors/{id}", () => {
    test("Author can be deleted successfuly after its creation", async () => {
        const idBook = await booksSteps.getExistingBookOrAddNewOne();
        const postRequest = generateAuthorRequest({idBook});
        const expectedResponse = {
            ...postRequest, id: expect.toBePositive()
        };
        const response = await authorSteps.addAuthorAndValidate(postRequest, expectedResponse);
        await authorSteps.deleteAuthorAndValidate(response.id);
        await authorSteps.getAuthorAndValidate(response, 404);
    });

    test("Delete an author with non-existing id should return successful response code", async () => {
        await authorSteps.deleteAuthorAndValidate(0); //assume that it should return 200
    });

    test("Validation error should appear when deleting an author with invalid id", async () => {
        await authorSteps.deleteAuthorAndValidate(INT_32 + 1, 400, validationMessages.VALUE_NOT_VALID(INT_32 + 1));
    });
});