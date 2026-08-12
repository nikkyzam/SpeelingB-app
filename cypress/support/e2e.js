import './commands';
import '@testing-library/cypress/add-commands';
import '@cypress/code-coverage/support';
before(() => {
  cy.log('🚀 Starting E2E Test Suite');
  cy.clearCookies();
  cy.clearLocalStorage();
});
beforeEach(() => {
  cy.log(`\n📋 Starting test: "${Cypress.currentTest.title}"`);
  cy.visit('/', { timeout: 30000 });
  cy.get('[data-testid="app-container"]', { timeout: 10000 }).should('exist');
});
afterEach(function() {
  if (this.currentTest.state === 'failed') {
    const testName = this.currentTest.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    cy.screenshot(`failure_${testName}`);
  }
});
Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('ResizeObserver loop limit exceeded')) return false;
  return true;
});
