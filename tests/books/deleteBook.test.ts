import {INT_32, validationMessages} from "../../src/constants";
import {BooksApiSteps} from "../../src/steps/booksApiSteps";
import {generateBookRequest} from "../../src/utils/generators";

const steps = new BooksApiSteps();

describe("DELETE /api/v1/Books/{id}", () => {
    test("Book can be deleted successfuly after its creation", async () => {
        const request = generateBookRequest({});
        const expectedResponse = {
            ...request, id: expect.toBePositive()
        };
        const response = await steps.addBookAndValidate(request, expectedResponse);
        await steps.deleteBookAndValidate(response.id);
        await steps.getBookAndValidate(response, 404);
    });

    test("Delete a book with non-existing id should return successful response code", async () => {
        await steps.deleteBookAndValidate(0); //assume that it should return 200
    });

    test("Validation error should appear when deleting a book with invalid id", async () => {
        await steps.deleteBookAndValidate(INT_32 + 1, 400, validationMessages.VALUE_NOT_VALID(INT_32 + 1));
    });
});