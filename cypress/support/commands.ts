/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-testid attribute.
       * @example cy.getByTestId('greeting')
       */
      getByTestId(value: string): Chainable<JQuery<HTMLElement>>;

      /**
       * Custom command to find elements by data-testid attribute within a subject.
       * @example cy.get('form').findByTestId('submit-button')
       */
      findByTestId(value: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

/**
 * Custom command to get element by data-testid
 */
Cypress.Commands.add('getByTestId', (selector: string) => {
  return cy.get(`[data-testid="${selector}"]`);
});

/**
 * Custom command to find element by data-testid within a subject
 */
Cypress.Commands.add('findByTestId', { prevSubject: true }, (subject, selector: string) => {
  return cy.wrap(subject).find(`[data-testid="${selector}"]`);
});

export {};
