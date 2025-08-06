import {BASE_URL} from "../../config";
import axios, {AxiosResponse} from 'axios';

export class AuthorsApiClient {
    private baseAuthorUrl = '/api/v1/Authors/';

    public async getAllAuthors(): Promise<AxiosResponse> {
        return await axios.get(`${BASE_URL}${this.baseAuthorUrl}`);
    }

    public async getSpecificAuthor(authorId: number, config?: object): Promise<AxiosResponse> {
        return await axios.get(`${BASE_URL}${this.baseAuthorUrl}${authorId}`, config);
    }

    public async addAuthor(body?: object, config?: object): Promise<AxiosResponse> {
        return await axios.post(`${BASE_URL}${this.baseAuthorUrl}`, body, config);
    }

    public async updateAuthor(authorId: number, body: object, config?: object): Promise<AxiosResponse> {
        return await axios.put(`${BASE_URL}${this.baseAuthorUrl}${authorId}`, body, config);
    }

    public async deleteAuthor(authorId: number, config?: object): Promise<AxiosResponse> {
        return await axios.delete(`${BASE_URL}${this.baseAuthorUrl}${authorId}`, config);
    }
}