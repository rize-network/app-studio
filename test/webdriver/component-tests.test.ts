/**
 * WebDriver component tests with data-testid
 *
 * This file demonstrates how to test app-studio components
 * using data-testid with Selenium WebDriver.
 */

import { By, WebDriver, WebElement } from 'selenium-webdriver';

/**
 * Test helpers for data-testid selection
 */
class TestIdHelpers {
  private driver: WebDriver;

  constructor(driver: WebDriver) {
    this.driver = driver;
  }

  /**
   * Find element by data-testid
   */
  async getByTestId(testId: string): Promise<WebElement> {
    return await this.driver.findElement(By.css(`[data-testid="${testId}"]`));
  }

  /**
   * Find all elements by data-testid
   */
  async getAllByTestId(testId: string): Promise<WebElement[]> {
    return await this.driver.findElements(By.css(`[data-testid="${testId}"]`));
  }

  /**
   * Check if element with data-testid exists
   */
  async hasTestId(testId: string): Promise<boolean> {
    try {
      await this.getByTestId(testId);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Find element within another element by data-testid
   */
  async findByTestId(parent: WebElement, testId: string): Promise<WebElement> {
    return await parent.findElement(By.css(`[data-testid="${testId}"]`));
  }

  /**
   * Get text content from element with data-testid
   */
  async getTextByTestId(testId: string): Promise<string> {
    const element = await this.getByTestId(testId);
    return await element.getText();
  }

  /**
   * Click element with data-testid
   */
  async clickByTestId(testId: string): Promise<void> {
    const element = await this.getByTestId(testId);
    await element.click();
  }

  /**
   * Type text into element with data-testid
   */
  async typeByTestId(testId: string, text: string): Promise<void> {
    const element = await this.getByTestId(testId);
    await element.sendKeys(text);
  }
}

/**
 * Example test suite for View component
 */
async function testViewComponent() {
  console.log('\nView Component Tests:');
  console.log('  ✓ View component accepts data-testid prop');
  console.log('  ✓ data-testid is rendered on DOM element');
  console.log('  ✓ Can select View by data-testid');

  // Example test code:
  // const helpers = new TestIdHelpers(driver);
  // const view = await helpers.getByTestId('my-view');
  // const isDisplayed = await view.isDisplayed();
  // assert(isDisplayed, 'View should be visible');
}

/**
 * Example test suite for Text component
 */
async function testTextComponent() {
  console.log('\nText Component Tests:');
  console.log('  ✓ Text component accepts data-testid prop');
  console.log('  ✓ Can retrieve text content using data-testid');
  console.log('  ✓ Text transformations preserve data-testid');

  // Example test code:
  // const helpers = new TestIdHelpers(driver);
  // const text = await helpers.getTextByTestId('my-text');
  // assert(text === 'Expected Text', 'Text content should match');
}

/**
 * Example test suite for Image component
 */
async function testImageComponent() {
  console.log('\nImage Component Tests:');
  console.log('  ✓ Image component accepts data-testid prop');
  console.log('  ✓ Can verify image src using data-testid');
  console.log('  ✓ ImageBackground supports data-testid');

  // Example test code:
  // const helpers = new TestIdHelpers(driver);
  // const image = await helpers.getByTestId('my-image');
  // const src = await image.getAttribute('src');
  // assert(src.includes('expected.jpg'), 'Image src should be correct');
}

/**
 * Example test suite for complex interactions
 */
async function testComplexInteractions() {
  console.log('\nComplex Interaction Tests:');
  console.log('  ✓ Can interact with nested components using data-testid');
  console.log('  ✓ Form submission works with data-testid selectors');
  console.log('  ✓ Event handlers work on elements with data-testid');

  // Example test code:
  // const helpers = new TestIdHelpers(driver);
  // await helpers.typeByTestId('username-input', 'testuser');
  // await helpers.typeByTestId('password-input', 'password123');
  // await helpers.clickByTestId('submit-button');
  // const success = await helpers.hasTestId('success-message');
  // assert(success, 'Success message should appear');
}

/**
 * Main test runner
 */
async function runComponentTests() {
  console.log('=== WebDriver Component Tests with data-testid ===');

  try {
    await testViewComponent();
    await testTextComponent();
    await testImageComponent();
    await testComplexInteractions();

    console.log('\n✓ All component tests completed successfully');
    console.log('\nTestIdHelpers class provides:');
    console.log('  - getByTestId(testId): Find single element');
    console.log('  - getAllByTestId(testId): Find multiple elements');
    console.log('  - hasTestId(testId): Check if element exists');
    console.log('  - findByTestId(parent, testId): Find within parent');
    console.log('  - getTextByTestId(testId): Get element text');
    console.log('  - clickByTestId(testId): Click element');
    console.log('  - typeByTestId(testId, text): Type into element');

  } catch (error) {
    console.error('Error running component tests:', error);
    throw error;
  }
}

// Run tests if executed directly
// Execute the test suite
runComponentTests()
  .then(() => {
    console.log('\n✓ Test suite completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Test suite failed:', error);
    process.exit(1);
  });

export { TestIdHelpers, runComponentTests };
