import {BooksApiSteps} from "../../src/steps/booksApiSteps";
import {generateBookRequest} from "../../src/utils/generators";

const steps = new BooksApiSteps();

describe("GET /api/v1/Books", () => {
    test("Successfully get all books", async () => {
        await steps.getAllBooksAndValidate();
    });

    test("Get all books after book is added, updated, deleted", async () => {
        const postRequest = generateBookRequest({});
        const postResponse = {
            ...postRequest, id: expect.toBePositive()
        };
        const response = await steps.addBookAndValidate(postRequest, postResponse);
        await steps.getAllBooksAndValidate(response);
        await steps.updateBookAndValidate(response.id, postRequest, postResponse);
        await steps.getAllBooksAndValidate(response);
        await steps.deleteBookAndValidate(response.id);
        await steps.getAllBooksAndValidate(response, false);
    });
});