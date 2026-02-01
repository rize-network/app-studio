# E2E Testing Guide

This directory contains end-to-end (e2e) tests for the app-studio framework using Selenium WebDriver.

## Quick Start

### Running WebDriver Tests

```bash
npm run test:e2e:webdriver
```

This will run both test suites:
1. `data-testid.test.ts` - Basic data-testid helper functions
2. `component-tests.test.ts` - Component testing with TestIdHelpers class

## Test Structure

### WebDriver Tests

Located in `e2e-tests/webdriver/`:

- **data-testid.test.ts**: Core helper functions for finding elements by data-testid
- **component-tests.test.ts**: TestIdHelpers class with comprehensive methods

### Cypress Tests

Located in `cypress/e2e/`:

- **data-testid.cy.ts**: Basic Cypress tests for data-testid
- **component-integration.cy.ts**: Integration tests for complex scenarios

## Using data-testid in Tests

### WebDriver Examples

```typescript
import { findByTestId, waitForTestId } from '../e2e-tests/webdriver/data-testid.test';
import { TestIdHelpers } from '../e2e-tests/webdriver/component-tests.test';

// Using helper functions
const element = await findByTestId(driver, 'my-button');
await element.click();

// Using TestIdHelpers class
const helpers = new TestIdHelpers(driver);
await helpers.clickByTestId('submit-button');
const text = await helpers.getTextByTestId('message');
```

### Cypress Examples

```typescript
// Using custom commands
cy.getByTestId('login-form').should('exist');
cy.getByTestId('username-input').type('testuser');
cy.getByTestId('submit-button').click();

// Finding within parent
cy.get('form').findByTestId('error-message').should('be.visible');
```

## Helper Functions and Methods

### WebDriver Helper Functions

**findByTestId(driver, testId)**
- Finds a single element by data-testid attribute
- Returns: `Promise<WebElement>`

**waitForTestId(driver, testId, timeout)**
- Waits for an element to appear by data-testid
- Returns: `Promise<WebElement>`

### TestIdHelpers Class

```typescript
const helpers = new TestIdHelpers(driver);

// Find elements
await helpers.getByTestId('element-id');
await helpers.getAllByTestId('list-item');
await helpers.hasTestId('optional-element');

// Interact with elements
await helpers.clickByTestId('button-id');
await helpers.typeByTestId('input-id', 'text');

// Get information
const text = await helpers.getTextByTestId('text-id');

// Find nested elements
const parent = await helpers.getByTestId('parent-id');
const child = await helpers.findByTestId(parent, 'child-id');
```

### Cypress Custom Commands

```typescript
cy.getByTestId(selector)
  - Find element by data-testid

cy.get('parent').findByTestId(selector)
  - Find element within parent by data-testid
```

## Prerequisites

### For Cypress Tests

1. Install Cypress:
   ```bash
   npm install --save-dev cypress
   ```

2. Start Storybook (test target):
   ```bash
   npm run storybook
   ```

3. Run Cypress:
   ```bash
   npm run test:e2e:cypress:open  # Interactive mode
   npm run test:e2e:cypress       # Headless mode
   ```

### For WebDriver Tests

1. Install dependencies:
   ```bash
   npm install --save-dev selenium-webdriver @types/selenium-webdriver
   ```

2. Install ChromeDriver (optional, for actual browser testing):
   ```bash
   npm install --save-dev chromedriver
   ```
   Or download from: https://chromedriver.chromium.org/

3. Run tests:
   ```bash
   npm run test:e2e:webdriver
   ```

## Writing New Tests

### WebDriver Test Template

```typescript
import { Builder, By } from 'selenium-webdriver';
import { TestIdHelpers } from './component-tests.test';

async function myNewTest() {
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    const helpers = new TestIdHelpers(driver);

    await driver.get('http://localhost:6006');

    // Your test logic here
    await helpers.clickByTestId('my-element');

    console.log('✓ Test passed');
  } finally {
    await driver.quit();
  }
}
```

### Cypress Test Template

```typescript
describe('My New Test Suite', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should test something', () => {
    cy.getByTestId('element').should('exist');
    cy.getByTestId('button').click();
    cy.getByTestId('result').should('contain', 'Expected Text');
  });
});
```

## Best Practices

1. **Use data-testid for all test selectors**
   - More stable than CSS classes
   - Semantic and self-documenting
   - Won't break if styling changes

2. **Use descriptive test IDs**
   ```tsx
   // Good
   <Button data-testid="submit-login-form">Submit</Button>

   // Avoid
   <Button data-testid="btn1">Submit</Button>
   ```

3. **Organize tests by feature**
   - Group related tests in describe blocks
   - Use clear test descriptions

4. **Clean up after tests**
   - Always quit WebDriver in finally blocks
   - Clean up test data between Cypress tests

5. **Use helper functions/classes**
   - Reduces duplication
   - Makes tests more maintainable
   - Provides consistent API

## Troubleshooting

### ChromeDriver Issues

If you get ChromeDriver errors:

1. Check Chrome version: `google-chrome --version`
2. Download matching ChromeDriver from https://chromedriver.chromium.org/
3. Add to PATH or use chromedriver package

### Cypress Issues

If Cypress can't find elements:

1. Make sure Storybook is running on port 6006
2. Check that the element has data-testid attribute
3. Use `cy.debug()` to inspect the state

### TypeScript Issues

If you get type errors:

1. Make sure @types packages are installed
2. Check tsconfig.json includes test directories
3. Restart TypeScript server in your IDE

## Additional Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [Selenium WebDriver Documentation](https://www.selenium.dev/documentation/webdriver/)
- [Testing Library Best Practices](https://testing-library.com/docs/queries/about/#priority)
- [Main E2E Testing Report](../E2E_TESTING_REPORT.md)
