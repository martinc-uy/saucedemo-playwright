# Sauce Demo Playwright Tests

End to end test automation for [Sauce Demo](https://www.saucedemo.com), built with Playwright and TypeScript using Page Object Model.

## Stack

- Playwright Test
- TypeScript
- Page Object Model

## Project structure

```
.
├── data/          Test data (users and credentials)
├── pages/         Page objects (locators and page actions)
├── tests/         Test specs
└── playwright.config.ts
```

## Getting started

Requirements: Node.js 18 or higher.

```bash
git clone https://github.com/martinc-uy/saucedemo-playwright.git
cd saucedemo-playwright
npm ci
npx playwright install
```

## Running the tests

Run all tests in headless mode:

```bash
npx playwright test
```

Run with the Playwright UI:

```bash
npx playwright test --ui
```

Run a single spec:

```bash
npx playwright test tests/checkout.spec.ts
```

Open the HTML report after a run:

```bash
npx playwright show-report
```

## Test coverage

**Login**
- Successful login with a valid user
- Error message with invalid credentials

**Inventory**
- Sort products by name, A to Z and Z to A
- Sort products by price, ascending and descending
- All product images load correctly

**Cart**
- Add several products and remove one, verifying the cart badge and contents

**Checkout**
- Full purchase flow, including subtotal, tax and total validation
- Price validation with more than one product
- Required field validation on the information form
- Order confirmation PDF download

## Design notes

- Locators live in page objects, so specs only describe behavior.
- Test data is kept in `data/testData.json` instead of being hardcoded in each test.
- The base URL is set in `playwright.config.ts`, so tests only use relative paths.
