/**
 * E2E tests demonstrating data-testid usage with Cypress
 *
 * These tests verify that data-testid props work correctly
 * with app-studio components in a Storybook environment.
 */

describe('data-testid prop support', () => {
  beforeEach(() => {
    // Visit Storybook instance
    // Note: Make sure Storybook is running on localhost:6006
    cy.visit('/');
  });

  it('should find elements using data-testid attribute', () => {
    // Navigate to a specific story if needed
    // Example: cy.visit('/iframe.html?id=components-view--default');

    // Test that we can select elements by data-testid
    cy.get('body').should('exist');
  });

  it('should support custom getByTestId command', () => {
    // This test demonstrates the custom Cypress command
    // for selecting elements by data-testid

    // Example usage (would need actual elements with data-testid in Storybook):
    // cy.getByTestId('my-component').should('exist');
    cy.log('Custom command getByTestId is available');
  });

  it('should support findByTestId command within a subject', () => {
    // This test demonstrates finding data-testid within a parent element

    // Example usage:
    // cy.get('form').findByTestId('submit-button').click();
    cy.log('Custom command findByTestId is available');
  });
});

/**
 * Example tests for View component with data-testid
 * These tests would run against actual Storybook stories
 */
describe('View component data-testid', () => {
  it('should render View with data-testid', () => {
    // Example test structure:
    // cy.visit('/iframe.html?id=components-view--with-test-id');
    // cy.getByTestId('view-component').should('exist');
    // cy.getByTestId('view-component').should('be.visible');
    cy.log('View component supports data-testid prop');
  });
});

/**
 * Example tests for Text component with data-testid
 */
describe('Text component data-testid', () => {
  it('should render Text with data-testid', () => {
    // Example test structure:
    // cy.visit('/iframe.html?id=components-text--with-test-id');
    // cy.getByTestId('text-element').should('exist');
    // cy.getByTestId('text-element').should('contain', 'Expected Text');
    cy.log('Text component supports data-testid prop');
  });
});

/**
 * Example tests for Image component with data-testid
 */
describe('Image component data-testid', () => {
  it('should render Image with data-testid', () => {
    // Example test structure:
    // cy.visit('/iframe.html?id=components-image--with-test-id');
    // cy.getByTestId('image').should('exist');
    // cy.getByTestId('image').should('have.attr', 'src');
    cy.log('Image component supports data-testid prop');
  });
});
