import {AxiosResponse} from "axios";
import {statusTextCode} from "../constants";
import {Book} from "../api_dtos/books.dto";
import * as allure from "allure-js-commons";

export class BaseSteps {
    public async validateRequestData(actualResponse: AxiosResponse, expectedResponse: Partial<Book>, statusCode: number, title?: string) {
        await allure.step("Verify response status code, statusText and data if present", async () => {
            expect(actualResponse.status).toBe(statusCode);
            expect(actualResponse.statusText).toBe(statusTextCode.get(statusCode));
            if (statusCode === 200) {
                expect(actualResponse.data).toMatchObject(expectedResponse); //consider id to be positive
            }
            if (actualResponse.data.errors) {
                expect(Object.values(actualResponse.data.errors)[0]).toContain(title);
            }
        });
    }
}