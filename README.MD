# About
- This project was created to validate fakerest API (https://fakerestapi.azurewebsites.net/index.html) using `typescript + jest` and `allure` for reporting

## Project structure
- ./src/api_clients - contains specific classes to work with api (author, book, etc.)
- ./src/api_dtos - request/response models for different API requests
- ./src/steps - contain test steps separate for each APIs
- ./src/utils - primarily used for data generation
- ./src/constants - data considered not be changed
- ./tests - contains related API tests
- ./allure-results - folder, where test report data is generated

## How to run test locally and generate report
1. Make sure Node.js is installed (20.12+)
2. Make sure Java 8+ is installed
3. Install allure with `npm install -g allure-commandline` (more info here: https://allurereport.org/docs/install-for-nodejs/)
4. Execute `npm install` to download all the dependency
5. Execute `npm run test` to run all the tests
6. For test report generation: `npm run allure` (alternatively it's possible to run `npm run allure-generate` to generate html one with all data, but the first one is preferable because some files may not be properly displayed in browser)

## How to run tests inside the docker container
1. Make sure docker is installed
2. From the root directory run `docker build -t fakerest/1.0 .`
3. Execute `docker run --env BASE_URL=https://fakerestapi.azurewebsites.net fakerest/1.0` (BASE_URL are not mandatory here, but just for an example how to send environment variable)

## How to run test on the docker container inside Jenkins
1. Jenkins with default plugins is installed (contains ones to work with git, docker, etc.)
2. Make sure, that `Allure Jenkins Plugin` is installed
3. Make sure, that `Allure Commandline installations` added in global tools (`${url}/manage/configureTools/`)
4. Create a job from pipeline and add source for it as `Pipeline script from SCM` (Git, source: `https://github.com/tirador1201/fakerestapi.git`, branch: */main)
