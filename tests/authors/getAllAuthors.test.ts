import {AuthorsApiSteps} from "../../src/steps/authorsApiSteps";
import {BooksApiSteps} from "../../src/steps/booksApiSteps";
import {generateAuthorRequest} from "../../src/utils/generators";

const booksSteps = new BooksApiSteps();
const authorSteps = new AuthorsApiSteps();

describe("GET /api/v1/Authors", () => {

    test("Successfully get all authors", async () => {
        await authorSteps.getAllAuthorsAndValidate();
    });

    test("Get all authors after author is added, updated, deleted", async () => {
        const idBook = await booksSteps.getExistingBookOrAddNewOne();
        const postRequest = generateAuthorRequest({idBook});
        const expectedResponse = {
            ...postRequest, id: expect.toBePositive()
        };
        const response = await authorSteps.addAuthorAndValidate(postRequest, expectedResponse);
        await authorSteps.getAllAuthorsAndValidate(response);
        await authorSteps.updateAuthorAndValidate(response.id, postRequest, expectedResponse);
        await authorSteps.getAllAuthorsAndValidate(response);
        await authorSteps.deleteAuthorAndValidate(response.id);
        await authorSteps.getAllAuthorsAndValidate(response, false);
    });
});