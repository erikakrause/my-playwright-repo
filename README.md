# Playwright Test Project

This project is set up to use the Playwright test runner for end-to-end testing of web applications. Below are the instructions for setting up and running the tests.

## Prerequisites

- Node.js (version 12 or later)
- npm (Node package manager)

## Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd playwright-test-project
   ```

2. Install the dependencies:

   ```
   npm install
   ```

## Configuration

The Playwright test runner is configured in the `playwright.config.ts` file. It includes:

- `baseURL`: The base URL for the tests.
- `timeout`: A maximum timeout of 5 seconds for each test.

## Running Tests

To run the tests, use the following command:

```
npx playwright test
```

This will execute all tests located in the `tests` directory.

## Continuous Integration

The project includes a GitHub Actions workflow defined in `.github/workflows/ci.yml`. This workflow installs the necessary dependencies and runs the tests using only the Chromium browser.

## Writing Tests

Tests are located in the `tests` directory. The first test specification can be found in `example.spec.ts`. You can create additional test files following the same structure.

## License

This project is licensed under the MIT License.