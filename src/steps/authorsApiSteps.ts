import {AuthorsApiClient} from "../api_clients/authorsApiClient";
import {faker} from "@faker-js/faker";
import 'jest-extended';
import {objectWithId, statusFunction, statusTextCode} from "../constants";
import {BaseSteps} from "./baseSteps";
import * as allure from "allure-js-commons";
import {Author} from "../api_dtos/authors.dto";

export class AuthorsApiSteps extends BaseSteps {
    private authorApiClient: AuthorsApiClient;

    constructor() {
        super();
        this.authorApiClient = new AuthorsApiClient();
    }

    public async getAllAuthorsAndValidate(expectedResponse?: Partial<Author>, present = true): Promise<void> {
        await allure.step("Get all authors and validate data (for specific author if required)", async () => {
            const response = await this.authorApiClient.getAllAuthors();
            expect(response.status).toBe(200);
            expect(response.statusText).toBe(statusTextCode.get(200));
            if (response.data) {
                const authorNumber = faker.number.int({max: response.data.length})
                expect(response.data[authorNumber]).toMatchObject({
                    id: authorNumber + 1,
                    idBook: expect.toBePositive(),
                    firstName: expect.toBeOneOf([expect.any(String), null]),
                    lastName: expect.toBeOneOf([expect.any(String), null]),
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
    }

    public async addAuthorAndValidate(
        request: Partial<Author>,
        expectedResponse: Partial<Author>,
        headers?: object,
        title?: string,
        statusCode = 200): Promise<objectWithId> {
        let response;
        await allure.step("Add an author and validate response", async () => {
            response = await this.authorApiClient.addAuthor(request, {
                headers,
                validateStatus: statusFunction
            });
            await this.validateRequestData(response, expectedResponse, statusCode, title);
        });
        return response!.data;
    }

    public async getAuthorAndValidate(expectedResponse: Partial<Author>, statusCode = 200, title?: string): Promise<void> {
        await allure.step("Get an author and validate response", async () => {
            const response = await this.authorApiClient.getSpecificAuthor(expectedResponse.id!, {validateStatus: statusFunction});
            await this.validateRequestData(response, expectedResponse, statusCode, title);
        });
    }

    public async updateAuthorAndValidate(bookId: number, request: Partial<Author>,
        expectedResponse: Author | object,
        headers?: object,
        title?: string,
        statusCode = 200): Promise<void> {
        await allure.step("Update an author and validate response", async () => {
            const response = await this.authorApiClient.updateAuthor(bookId, request, {
                headers,
                validateStatus: statusFunction
            });
            await this.validateRequestData(response, expectedResponse, statusCode, title);
        });
    }

    public async deleteAuthorAndValidate(authorId: number, statusCode = 200, title?: string): Promise<void> {
        await allure.step("Delete an author and validate response", async () => {
            const response = await this.authorApiClient.deleteAuthor(authorId, {
                validateStatus: statusFunction
            });
            expect(response.status).toBe(statusCode);
            expect(response.statusText).toBe(statusTextCode.get(statusCode));
            if (response.data.errors) {
                expect(Object.values(response.data.errors)[0]).toContain(title);
            }
        });
    }
}