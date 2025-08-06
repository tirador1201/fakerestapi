/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type {Config} from "jest";
import {pathsToModuleNameMapper} from "ts-jest";
import * as os from 'os'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const {compilerOptions} = require("./tsconfig");

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "allure-jest/node",
  testEnvironmentOptions: {
    resultsDir: "allure-results",
    links: {
      issue: {
        nameTemplate: "Issue #%s",
        urlTemplate: "https://fxpropm.atlassian.net/browse/%s",
      },
      tms: {
        nameTemplate: "TMS #%s",
        urlTemplate: "https://fxpropm.atlassian.net/browse/%s",
      },
      jira: {
        urlTemplate: (v: string) => `https://fxpropm.atlassian.net/browse/${v}`,
      },
    },
    environmentInfo: {
      os_platform: os.platform(),
      os_release: os.release(),
      os_version: os.version(),
      node_version: process.version,
    },
  },

  testTimeout: 10000,
  setupFilesAfterEnv: ['jest-extended/all'],
  moduleNameMapper: compilerOptions.paths
    ? pathsToModuleNameMapper(compilerOptions.paths, {prefix: "<rootDir>"})
    : undefined,
};

export default config;
