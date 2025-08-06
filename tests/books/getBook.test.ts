import {INT_32, validationMessages} from "../../src/constants";
import {BooksApiSteps} from "../../src/steps/booksApiSteps";
import {generateBookRequest} from "../../src/utils/generators";

const steps = new BooksApiSteps();

describe("GET /api/v1/Books/{id}", () => {
    test("Information of the book can be retrieved successfully after book is added", async () => {
        const request = generateBookRequest({});
        const expectedResponse = {
            ...request, id: expect.toBePositive()
        };
        const response = await steps.addBookAndValidate(request, expectedResponse);
        await steps.getBookAndValidate(response);
    });

    test("Validation error should appear when getting a non-existing book", async () => {
        await steps.getBookAndValidate({id: 0}, 404); //assume that 0 is not a valid id to store
    });

    test("Validation error should appear when getting a book with invalid id", async () => {
        await steps.getBookAndValidate({id: INT_32 + 1}, 400, validationMessages.VALUE_NOT_VALID(INT_32 + 1));
    });

});

