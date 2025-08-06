import {BASE_URL} from "../../config";
import axios, {AxiosResponse} from 'axios';

export class BooksApiClient {
    private baseBooksUrl = '/api/v1/Books/';

    public async getAllBooks(): Promise<AxiosResponse> {
        return await axios.get(`${BASE_URL}${this.baseBooksUrl}`);
    }

    public async getSpecificBook(bookId: number, config?: object): Promise<AxiosResponse> {
        return await axios.get(`${BASE_URL}${this.baseBooksUrl}${bookId}`, config);
    }

    public async addBook(body?: object, config?: object): Promise<AxiosResponse> {
        return await axios.post(`${BASE_URL}${this.baseBooksUrl}`, body, config);
    }

    public async updateBook(bookId: number, body: object, config?: object): Promise<AxiosResponse> {
        return await axios.put(`${BASE_URL}${this.baseBooksUrl}${bookId}`, body, config);
    }

    public async deleteBook(bookId: number, config?: object): Promise<AxiosResponse> {
        return await axios.delete(`${BASE_URL}${this.baseBooksUrl}${bookId}`, config);
    }
}