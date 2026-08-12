describe('Basic Smoke Tests', () => {
  it('should load the home page', () => {
    cy.visit('/');
    cy.contains('Kids Spelling Bee').should('be.visible');
  });
  it('should navigate to learning hub', () => {
    cy.visit('/');
    cy.get('[data-testid="learning-hub-nav"]').click();
    cy.url().should('include', '/learning');
  });
});
