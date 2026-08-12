import '@testing-library/cypress/add-commands';
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/');
  cy.get('[data-testid="login-button"]').click();
  cy.get('[data-testid="email-input"]').clear().type(email);
  cy.get('[data-testid="password-input"]').clear().type(password);
  cy.get('[data-testid="submit-login"]').click();
  cy.get('[data-testid="user-avatar"]', { timeout: 15000 }).should('be.visible');
});
Cypress.Commands.add('completeDailyGoal', (goal = 30) => {
  cy.get('[data-testid="learn-mode-button"]').click();
  for (let i = 0; i < goal; i++) {
    cy.get('[data-testid^="word-card-"]').eq(i % 5).click();
    cy.get('[data-testid="next-word-button"]').click();
    cy.get('[data-testid="progress-indicator"]').should('contain.text', `${i + 1}/${goal}`);
  }
  cy.get('[data-testid="practice-mode-button"]').should('not.be.disabled');
});
