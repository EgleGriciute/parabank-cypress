# ParaBank Website Testing Portfolio 💸

## Overview
This repository contains a comprehensive test suite for the ParaBank (https://parabank.parasoft.com/parabank/index.htm) demonstration website using Cypress. The test suite includes end-to-end tests, API tests, and form validations to ensure the functionality of the ParaBank web application.

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/EgleGriciute/parabank_website_full_testing_portfolio.git
   cd parabank_website_full_testing_portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running Tests

### Open Cypress Test Runner
To open the Cypress Test Runner for interactive testing:
```bash
npm run cypress:open
```

### Run All Tests Headlessly
To run all tests in headless mode:
```bash
npm run cypress:run
```

### Run Specific Test Files
To run a specific test file:
```bash
npx cypress run --spec "cypress/e2e/path/to/file.cy.js"
```

## Test Structure

The test suite is organized in the `cypress/e2e` directory as follows:

- **api/** - Tests for RESTful API endpoints
- **form-validations/** - Tests for form input validation
- **login/** - Tests for user authentication
- **account-services/** - Tests for banking account functionalities
- **registration/** - Tests for user registration process

## Dependencies

This project uses the following dependencies:

- **Cypress** (v14.1.0) - Main testing framework
- **@faker-js/faker** (v9.6.0) - For generating test data
- **cypress-ntlm-auth** (v4.2.1) - For handling NTLM authentication if required
- **cypress-xpath** (v2.0.1) - For using XPath selectors in tests
- **newman** (v6.2.1) - For running Postman collections

## Test Reports

After running tests in headless mode, test reports will be generated in the following formats:
- Video recordings: `cypress/videos/`
- Screenshots of failures: `cypress/screenshots/`

