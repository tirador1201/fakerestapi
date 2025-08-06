import {Author} from "../api_dtos/authors.dto";
import {Book} from "../api_dtos/books.dto";
import {INT_32} from "../constants";
import {faker} from "@faker-js/faker";

export function generateBookRequest(overrides: Partial<Book>): Book {
    return {
        id: faker.number.int({max: INT_32}),
        title: faker.string.sample(),
        description: faker.string.sample(),
        pageCount: faker.number.int({max: INT_32}),
        excerpt: faker.string.sample(),
        publishDate: new Date().toISOString().slice(0, -5) + "Z",
        ...overrides
    }
}

export function generateDefaultBookResponse(): Book {
    return {
        id: 0,
        title: null,
        description: null,
        pageCount: 0,
        excerpt: null,
        publishDate: "0001-01-01T00:00:00",
    }
}

export function generateAuthorRequest(overrides: Partial<Author>): Author {
    return {
        id: faker.number.int({max: INT_32}),
        idBook: faker.number.int({max: INT_32}),
        firstName: faker.string.sample(),
        lastName: faker.string.sample(),
        ...overrides
    }
}

export function generateDefaultAuthorResponse(): Author {
    return {
        id: 0,
        idBook: 0,
        firstName: null,
        lastName: null,
    }
}