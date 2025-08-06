import {BooksApiClient} from "../api_clients/booksApiClients";
import {Book} from "../api_dtos/books.dto";
import {faker} from "@faker-js/faker";
import 'jest-extended';
import {objectWithId, statusFunction, statusTextCode} from "../constants";
import {BaseSteps} from "./baseSteps";
import * as allure from "allure-js-commons";
import {generateBookRequest} from "../utils/generators";

export class BooksApiSteps extends BaseSteps {
    private booksApiClient: BooksApiClient;

    constructor() {
        super();
        this.booksApiClient = new BooksApiClient();
    }

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async getAllBooksAndValidate(expectedResponse?: Partial<Book>, present = true): Promise<any> {
        let response;
        await allure.step("Get all books and validate data (for specific book if required)", async () => {
            response = await this.booksApiClient.getAllBooks();
            expect(response.status).toBe(200);
            expect(response.statusText).toBe(statusTextCode.get(200));
            if (response.data) {
                const bookNumber = faker.number.int({max: response.data.length})
                expect(response.data[bookNumber]).toMatchObject({
                    id: bookNumber + 1,
                    title: expect.toBeOneOf([expect.any(String), null]),
                    description: expect.toBeOneOf([expect.any(String), null]),
                    pageCount: expect.any(Number),
                    excerpt: expect.toBeOneOf([expect.any(String), null]),
                    publishDate: expect.any(String),
                });
            }
            //eslint-disable-next-line @typescript-eslint/no-unused-expressions
            const result = response.data.filter((data: objectWithId) => {data.id === expectedResponse?.id});
            if (expectedResponse && present) {
                expect(result).toMatchObject(expectedResponse);
            } else if (!present) {
                expect(result).toBeFalsy();
            }
        });
        return response!.data;
    }

    public async addBookAndValidate(
        request: Partial<Book>,
        expectedResponse: Partial<Book>,
        headers?: object,
        title?: string,
        statusCode = 200): Promise<objectWithId> {
        let response;
        await allure.step("Add a book and validate response", async () => {
            response = await this.booksApiClient.addBook(request, {
                headers,
                validateStatus: statusFunction
            });
            await this.validateRequestData(response, expectedResponse, statusCode, title);
        });
        return response!.data;
    }

    public async getBookAndValidate(expectedResponse: Partial<Book>, statusCode = 200, title?: string): Promise<void> {
        await allure.step("Get a book and validate response", async () => {
            const response = await this.booksApiClient.getSpecificBook(expectedResponse.id!, {validateStatus: statusFunction});
            await this.validateRequestData(response, expectedResponse, statusCode, title);
        });
    }

    public async updateBookAndValidate(bookId: number, request: Partial<Book>,
        expectedResponse: Book | object,
        headers?: object,
        title?: string,
        statusCode = 200): Promise<void> {
        await allure.step("Update a book and validate response", async () => {
            const response = await this.booksApiClient.updateBook(bookId, request, {
                headers,
                validateStatus: statusFunction
            });
            await this.validateRequestData(response, expectedResponse, statusCode, title);
        });
    }

    public async deleteBookAndValidate(bookId: number, statusCode = 200, title?: string): Promise<void> {
        await allure.step("Delete a book and validate response", async () => {
            const response = await this.booksApiClient.deleteBook(bookId!, {
                validateStatus: statusFunction
            });
            expect(response.status).toBe(statusCode);
            expect(response.statusText).toBe(statusTextCode.get(statusCode));
            if (response.data.errors) {
                expect(Object.values(response.data.errors)[0]).toContain(title);
            }
        });
    }

    public async getExistingBookOrAddNewOne(): Promise<number> {
        let bookNumber = 0;
        await allure.step("Get a book from the list of existing or create a new one", async () => {

        })
        const data = await this.getAllBooksAndValidate();
        if (data) {
            bookNumber = data[0].id;
        } else {
            const request = generateBookRequest({});
            const expectedResponse = {
                ...request, id: expect.toBePositive()
            };
            const response = await this.addBookAndValidate(request, expectedResponse);
            bookNumber = response.id;
        }
        return bookNumber;
    }
}